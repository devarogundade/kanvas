// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Assets} from "./libraries/Assets.sol";
import {Params} from "./libraries/Params.sol";
import {IKanvasAvax} from "./interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "./interfaces/IKanvasGame.sol";
import {IKanvasInteropGame} from "./interfaces/IKanvasInteropGame.sol";
import {StringJoiner} from "./libraries/StringJoiner.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

import {FunctionsClient} from "./chainlink/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

contract KanvasAvax is
    IKanvasAvax,
    Context,
    CCIPReceiver,
    FunctionsClient,
    Ownable
{
    using FunctionsRequest for FunctionsRequest.Request;

    uint256 public constant MAX_PROPERTIES_LEN = 20;

    // Javascript Chainlink functions source code
    string private _sourceCode;

    // Chainlink functions fulfill callback gas limit
    uint32 private _gasLimit = 300_000;

    // Chainlink Avalanche Subscription Id
    uint64 private _subscriptionId = 1580;

    // Chainlink Avalache DON Id
    bytes32 private _donId =
        0x66756e2d6176616c616e6368652d66756a692d31000000000000000000000000;

    // for testing purpose the generation fee is free
    uint256 private _kanvasGenerateFee = 0; // 3000000000000000

    // for testing purpose the bridge fee is free
    uint256 private _kanvasBridgeFee = 0; // 8000000000000000

    uint256 private _planId;
    mapping(uint256 => Assets.Plan) private _plans;

    mapping(address => Assets.Game) private _games;

    mapping(bytes32 => Assets.Request) private _requests;

    mapping(uint64 => address) private _interops;

    IRouterClient private _router;

    constructor(
        address ccipReceiver,
        address functionOracle
    ) CCIPReceiver(ccipReceiver) Ownable() FunctionsClient(functionOracle) {
        _router = IRouterClient(getRouter());
    }

    function updateDonId(bytes32 newDonId) external onlyOwner {
        _donId = newDonId;
    }

    function updateSourceCode(string memory newSourceCode) external onlyOwner {
        _sourceCode = newSourceCode;
    }

    function updateGasLimit(uint32 newLimit) external onlyOwner {
        _gasLimit = newLimit;
    }

    function updateSubscriptionId(uint64 newSubscriptionId) external onlyOwner {
        _subscriptionId = newSubscriptionId;
    }

    function depositEth() external payable {}

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

    function addTemplate(string memory templateUri, address gameId) external {
        address creator = _msgSender();

        Assets.Game storage game = _games[gameId];

        require(game.creator == creator, "UnAuthorized");

        emit TemplateAdded(gameId, templateUri);
    }

    function _generateUri(
        address playerId,
        string[] memory props,
        string memory fields,
        uint8 templateId
    ) external payable override {
        require(msg.value == _kanvasGenerateFee, "invalid Kanvas fee");
        require(props.length <= MAX_PROPERTIES_LEN, "Too many attributes");

        address gameId = _msgSender();
        require(_games[gameId].creator != address(0), "Game Not Found");

        string[] memory args = new string[](5);
        args[0] = StringJoiner.joinStrings(props, ",");
        args[1] = fields;
        args[2] = Strings.toHexString(gameId);
        args[3] = Strings.toHexString(playerId);
        args[4] = Strings.toString(templateId);

        // Initialize the request
        FunctionsRequest.Request memory req;

        // Soucre code
        req.initializeRequestForInlineJavaScript(_sourceCode);

        // Add arguments
        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            _subscriptionId,
            _gasLimit,
            _donId
        );

        _requests[requestId] = Assets.Request({
            gameId: gameId,
            playerId: playerId,
            fulfilled: false
        });

        emit GameEvent(
            requestId,
            gameId,
            playerId,
            Assets.EventType.GENERATE_URI,
            bytes(fields)
        );
    }

    function updateInterop(
        uint64 chainSelector,
        address kanvasRouter
    ) external onlyOwner {
        _interops[chainSelector] = kanvasRouter;
    }

    /** Receive the response in the form of string  */
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        Assets.Request storage request = _requests[requestId];
        require(!request.fulfilled, "Already fulfilled");

        if (err.length > 0) {
            emit GameEvent(
                requestId,
                request.gameId,
                request.playerId,
                Assets.EventType.RECEIVE_URI,
                err
            );
            return;
        }

        request.fulfilled = true;

        require(_games[request.gameId].creator != address(0), "Game Not Found");

        IKanvasGame game = IKanvasGame(request.gameId);
        game._receiveUri(request.playerId, string(response));

        emit GameEvent(
            requestId,
            request.gameId,
            request.playerId,
            Assets.EventType.RECEIVE_URI,
            response
        );
    }

    function _transferTo(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable {
        require(msg.value == _kanvasBridgeFee, "invalid Kanvas fee");
        require(_interops[chainSelector] != address(0), "Chain not supported");

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            // ABI-encoded receiver address
            receiver: abi.encode(_interops[chainSelector]),
            // ABI-encoded string message
            data: abi.encode(gameId, playerId, tokenId, uri, data),
            // Empty array indicating no tokens are being sent
            tokenAmounts: new Client.EVMTokenAmount[](0),
            // Additional arguments, setting gas limit and non-strict sequency mode
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 2_000_000, strict: false})
            ),
            // Setting feeToken to zero address, indicating native asset will be used for fees
            feeToken: address(0)
        });

        // Get the fee required to send the message
        uint256 fees = _router.getFee(chainSelector, message);

        require(address(this).balance >= fees, "Insufficient fee");

        // Send the message through the router and store the returned message ID
        bytes32 messageId = _router.ccipSend{value: fees}(
            chainSelector,
            message
        );

        // uint256 overspent = msg.value - fees;

        // if (overspent > 0) {
        //     address payable receiver = payable(gameId);
        //     receiver.transfer(overspent);
        // }

        emit GameEvent(
            messageId,
            gameId,
            playerId,
            Assets.EventType.TRANSFER_TO,
            message.data
        );
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

        emit GameEvent(
            message.messageId,
            gameId,
            playerId,
            Assets.EventType.RECEIVE_FROM,
            message.data
        );
    }

    function _generateFee() external view override returns (uint256) {
        return _kanvasGenerateFee;
    }

    function _bridgeFee() external view override returns (uint256) {
        return _kanvasBridgeFee;
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
