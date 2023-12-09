// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Assets} from "./libraries/Assets.sol";
import {Params} from "./libraries/Params.sol";
import {IKanvasInterop} from "./interfaces/IKanvasInterop.sol";
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

// For Polygon Mumbai - Alone
// @dev Hardcoded vaolues for Mumbai

contract KanvasInterop is
    IKanvasInterop,
    Context,
    CCIPReceiver,
    FunctionsClient,
    Ownable
{
    using FunctionsRequest for FunctionsRequest.Request;
    uint64 private constant AVAX_SELECTOR = 14767482510784806043;

    uint256 public constant MAX_PROPERTIES_LEN = 20;

    // Javascript Chainlink functions source code
    string private _sourceCode;

    // Chainlink Polygon Subscription Id
    uint64 private _subscriptionId = 1066;

    // Chainlink functions fulfill callback gas limit
    uint32 private _gasLimit = 300_000;

    // Chainlink Polygon DON Id
    bytes32 private _donId =
        0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;

    // for testing purpose the generation fee is free
    uint256 private _kanvasGenerateFee = 0;

    // for testing purpose the bridge fee is free
    uint256 private _kanvasBridgeFee = 0;

    mapping(address => mapping(uint64 => address)) private _games;

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

    function _createGame(Params.InteropGame memory params) external override {
        _games[params.sourceGameId][AVAX_SELECTOR] = _msgSender();
    }

    function _generateUri(
        address playerId,
        string[] memory props,
        string memory fields,
        uint8 templateId
    ) external payable override {
        require(msg.value == _kanvasGenerateFee, "invalid Kanvas fee");
        require(props.length <= MAX_PROPERTIES_LEN, "Too many attributes");

        address gameId = _games[_msgSender()][AVAX_SELECTOR];
        require(gameId != address(0), "Game Not Found");

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

        IKanvasInteropGame game = IKanvasInteropGame(request.gameId);
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
        uint64 /* chainSelector */,
        address /* gameId */,
        address /* playerId */,
        uint256 /* tokenId */,
        string memory /* uri*/,
        bytes memory /* data*/
    ) external payable {
        revert("Method not available, use _withdrawTo");
    }

    function _withdrawTo(
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable {
        require(msg.value == _kanvasBridgeFee, "invalid Kanvas fee");
        require(_interops[AVAX_SELECTOR] != address(0), "Chain not supported");

        // Create an EVM2AnyMessage struct in memory with necessary information for sending a cross-chain message
        Client.EVM2AnyMessage memory message = Client.EVM2AnyMessage({
            // ABI-encoded receiver address
            receiver: abi.encode(_interops[AVAX_SELECTOR]),
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
        uint256 fees = _router.getFee(AVAX_SELECTOR, message);

        require(msg.value >= fees, "Insufficient fee");

        // Send the message through the router and store the returned message ID
        bytes32 messageId = _router.ccipSend{value: fees}(
            AVAX_SELECTOR,
            message
        );

        uint256 overspent = msg.value - fees;

        if (overspent > 0) {
            address payable receiver = payable(gameId);
            receiver.transfer(overspent);
        }

        emit GameEvent(
            messageId,
            gameId,
            playerId,
            Assets.EventType.TRANSFER_TO,
            message.data
        );
    }

    function _generateFee() external view override returns (uint256) {
        return _kanvasGenerateFee;
    }

    function _bridgeFee() external view override returns (uint256) {
        return _kanvasBridgeFee;
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

        address interopGameId = _games[gameId][AVAX_SELECTOR];

        IKanvasInteropGame game = IKanvasInteropGame(interopGameId);
        game._receiveFrom(AVAX_SELECTOR, gameId, playerId, tokenId, uri, data);

        emit GameEvent(
            message.messageId,
            gameId,
            playerId,
            Assets.EventType.RECEIVE_FROM,
            message.data
        );
    }
}
