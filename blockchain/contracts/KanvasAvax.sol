// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Assets} from "./libraries/Assets.sol";
import {Params} from "./libraries/Params.sol";
import {IKanvasAvax} from "./interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "./interfaces/IKanvasGame.sol";
import {IKanvasInteropGame} from "./interfaces/IKanvasInteropGame.sol";
import {StringJoiner} from "./libraries/StringJoiner.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {ChainlinkClient, Chainlink, LinkTokenInterface} from "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract KanvasAvax is
    IKanvasAvax,
    Context,
    CCIPReceiver,
    ChainlinkClient,
    Ownable
{
    uint64 private constant AVAX_SELECTOR = 14767482510784806043;
    uint256 public constant MAX_PROPERTIES_LEN = 20;
    uint256 public constant MAX_TEMPLATES_LEN = 5;
    using Chainlink for Chainlink.Request;

    string private BASE_URL = "";

    bytes32 private jobId;
    uint256 private fee;

    uint256 private _planId;
    mapping(uint256 => Assets.Plan) private _plans;

    mapping(address => Assets.Game) private _games;

    mapping(bytes32 => Assets.Request) private _requests;

    mapping(uint64 => address) private _interops;

    IRouterClient private _router;

    constructor(address receiver) CCIPReceiver(receiver) Ownable() {
        setChainlinkToken(0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846);
        setChainlinkOracle(0x022EEA14A6010167ca026B32576D6686dD7e85d2);
        jobId = "7d80a6386ef543a3abb52817f6707e3b";
        fee = (1 * LINK_DIVISIBILITY) / 10;

        _router = IRouterClient(getRouter());
    }

    function createGame(Params.Game memory params) external payable {
        require(_plans[params.plan].limit != 0, "Invalid plan");
        require(msg.value == _plans[params.plan].cost, "Insufficient funds");

        _games[params.gameId] = Assets.Game({
            name: params.name,
            description: params.description,
            avatar: params.avatar,
            plan: params.plan,
            creator: _msgSender()
        });

        emit GameCreated(
            params.gameId,
            params.name,
            params.description,
            params.avatar,
            params.plan,
            _msgSender(),
            params.email,
            params.website
        );
    }

    function addTemplate(string memory params, address gameId) external {
        address creator = _msgSender();

        Assets.Game storage game = _games[gameId];

        require(game.creator == creator, "UnAuthorized");

        emit TemplateAdded(gameId, params);
    }

    function _generateUri(
        address playerId,
        string[] memory properties,
        string memory fields,
        uint8 templateId
    ) external override {
        require(properties.length <= MAX_PROPERTIES_LEN, "Too many attributes");

        address gameId = _msgSender();
        require(_games[gameId].creator != address(0), "Game Not Found");

        Chainlink.Request memory req = buildChainlinkRequest(
            jobId,
            address(this),
            this.fulfill.selector
        );

        // Set the URL to perform the GET request on
        // https://server.com/generete/properties/fields/gameid/playerid
        req.add(
            "get",
            string.concat(
                BASE_URL,
                "/",
                StringJoiner.joinStrings(properties, ","),
                "/",
                fields,
                "/",
                Strings.toHexString(gameId),
                "/",
                Strings.toHexString(playerId),
                "/",
                Strings.toString(templateId)
            )
        );

        // Chainlink nodes 1.0.0 and later support this format
        req.add("path", "uri");

        // Sends the request
        bytes32 requestId = sendChainlinkRequest(req, fee);

        _requests[requestId] = Assets.Request({
            gameId: gameId,
            playerId: playerId,
            fulfilled: false
        });
    }

    function updateBaseUrl(string memory newBaseUrl) external onlyOwner {
        BASE_URL = newBaseUrl;
    }

    function updateInterop(
        uint64 chainSelector,
        address kanvasRouter
    ) external onlyOwner {
        _interops[chainSelector] = kanvasRouter;
    }

    /** Receive the response in the form of string  */
    function fulfill(
        bytes32 requestId,
        string memory uri
    ) public recordChainlinkFulfillment(requestId) {
        Assets.Request storage request = _requests[requestId];
        require(!request.fulfilled, "Already fulfilled");

        request.fulfilled = true;

        require(_games[request.gameId].creator != address(0), "Game Not Found");

        IKanvasGame game = IKanvasGame(request.gameId);
        game._receiveUri(request.playerId, uri);
    }

    /** Allow withdraw of Link tokens from the contract */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        link.transfer(msg.sender, link.balanceOf(address(this)));
    }

    function _transferTo(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable {
        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory evm2AnyMessage = Client.EVM2AnyMessage({
            // ABI-encoded receiver address
            receiver: abi.encode(_interops[chainSelector]),
            // ABI-encoded string message
            data: abi.encode(gameId, playerId, tokenId, uri, data),
            // Empty array indicating no tokens are being sent
            tokenAmounts: new Client.EVMTokenAmount[](0),
            // Additional arguments, setting gas limit and non-strict sequency mode
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 400_000, strict: false})
            ),
            // Setting feeToken to zero address, indicating native asset will be used for fees
            feeToken: address(0)
        });

        // Get the fee required to send the message
        uint256 fees = _router.getFee(AVAX_SELECTOR, evm2AnyMessage);

        require(msg.value >= fees, "Insufficient fee");

        // Send the message through the router and store the returned message ID
        _router.ccipSend{value: fees}(AVAX_SELECTOR, evm2AnyMessage);
    }

    // handle a received message
    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        (
            address gameId,
            address playerId,
            uint256 tokenId,
            string memory uri,
            bytes memory data
        ) = abi.decode(
                message.data,
                (address, address, uint256, string, bytes)
            );

        IKanvasInteropGame game = IKanvasInteropGame(gameId);
        game._receiveFrom(
            message.sourceChainSelector,
            gameId,
            playerId,
            tokenId,
            uri,
            data
        );
    }

    /** Create plans */
    function createPlan(Params.Plan memory params) external onlyOwner {
        _planId++;

        _plans[_planId] = Assets.Plan({
            name: params.name,
            cost: params.cost,
            color: params.color,
            limit: params.limit
        });

        emit PlanCreated(
            _planId,
            params.name,
            params.cost,
            params.color,
            params.limit
        );
    }
}
