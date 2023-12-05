// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Assets} from "./libraries/Assets.sol";
import {Params} from "./libraries/Params.sol";
import {IKanvasInterop} from "./interfaces/IKanvasInterop.sol";
import {IKanvasInteropGame} from "./interfaces/IKanvasInteropGame.sol";
import {IKanvasGame} from "./interfaces/IKanvasGame.sol";
import {StringJoiner} from "./libraries/StringJoiner.sol";

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

import {FunctionsClient} from "./FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

contract KanvasInterop is
    IKanvasInterop,
    Context,
    CCIPReceiver,
    FunctionsClient,
    Ownable
{
    using FunctionsRequest for FunctionsRequest.Request;

    uint64 private immutable _chainSelector;

    uint256 public constant MAX_PROPERTIES_LEN = 20;
    uint256 public constant MAX_TEMPLATES_LEN = 5;

    string private _sourceCode;
    uint64 private _subscriptionId;
    uint32 private _gasLimit;
    bytes32 private _donId;

    mapping(address => address) private _games;

    mapping(bytes32 => Assets.Request) private _requests;

    mapping(uint64 => address) private _interops;

    IRouterClient private _router;

    constructor(
        address ccipReceiver,
        address functionOracle,
        uint64 chainSelector
    ) CCIPReceiver(ccipReceiver) Ownable() FunctionsClient(functionOracle) {
        _router = IRouterClient(getRouter());
        _chainSelector = chainSelector;
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

    function _createGame(
        uint64 /* chainSelector */,
        Params.InteropGame memory params
    ) external override {
        _games[_msgSender()] = params.gameId;
    }

    function _generateUri(
        address playerId,
        string[] memory props,
        string memory fields,
        uint8 templateId
    ) external override {
        require(props.length <= MAX_PROPERTIES_LEN, "Too many attributes");

        address gameId = _games[_msgSender()];
        require(_games[gameId] != address(0), "Game Not Found");

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
        emit OCRResponse(requestId, response, err);

        if (err.length > 0) {
            emit FulfullFailed(requestId, err);
            return;
        }

        string memory uri = abi.decode(response, (string));

        Assets.Request storage request = _requests[requestId];
        require(!request.fulfilled, "Already fulfilled");

        if (Strings.equal(uri, "NULL")) {
            emit FulfullFailed(requestId, response);
            return;
        }

        request.fulfilled = true;

        require(_games[request.gameId] != address(0), "Game Not Found");

        IKanvasGame game = IKanvasGame(request.gameId);
        game._receiveUri(request.playerId, uri);

        emit FulfullSuccess(requestId, response);
    }

    function _transferTo(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable {
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
                Client.EVMExtraArgsV1({gasLimit: 400_000, strict: false})
            ),
            // Setting feeToken to zero address, indicating native asset will be used for fees
            feeToken: address(0)
        });

        // Get the fee required to send the message
        uint256 fees = _router.getFee(_chainSelector, message);

        require(msg.value >= fees, "Insufficient fee");

        // Send the message through the router and store the returned message ID
        _router.ccipSend{value: fees}(_chainSelector, message);
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
}
