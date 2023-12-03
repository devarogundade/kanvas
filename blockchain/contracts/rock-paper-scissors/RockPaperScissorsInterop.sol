// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Params} from "../libraries/Params.sol";
import {IKanvasInterop} from "../interfaces/IKanvasInterop.sol";
import {IKanvasInteropGame} from "../interfaces/IKanvasInteropGame.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract RockPaperScissorsInterop is IKanvasInteropGame, ERC721, Ownable {
    uint64 private constant AVAX_SELECTOR = 14767482510784806043;
    uint256 public constant MAX_PROPERTIES_LEN = 20;

    uint8 private constant WIN_NFT_TEMPLATE = 0;
    uint8 private constant LOST_NFT_TEMPLATE = 1;

    uint256 private _tokenId;

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) private _playerNfts;

    IKanvasInterop private kanvas;

    struct Player {
        string name;
        uint256 points;
        bool created;
    }

    mapping(address => Player) private _players;

    constructor(
        address kanvasRouter,
        address sourceGameId
    ) ERC721("RockPaperScissors", "RPS") IKanvasInteropGame() Ownable() {
        kanvas = IKanvasInterop(kanvasRouter);
        kanvas._createGame(
            AVAX_SELECTOR,
            Params.InteropGame({gameId: sourceGameId})
        );
    }

    function getPlayer(address playerId) external view returns (Player memory) {
        return _players[playerId];
    }

    /** Increase player points */
    function upgradePlayer(address playerId) external onlyOwner {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");

        player.points = player.points + 5;

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);

        string memory fields = "$player_name$ $player_points$";

        kanvas._generateUri(playerId, properties, fields, WIN_NFT_TEMPLATE);
    }

    /** Reduce player points */
    function downgradePlayer(address playerId) external onlyOwner {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");
        require(player.points >= 1, "Already defeated :)");

        player.points = player.points - 1;

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);

        string memory fields = "$player_name$ $player_points$";

        kanvas._generateUri(playerId, properties, fields, LOST_NFT_TEMPLATE);
    }

    /** Bridge game Nft function */
    function transferTo(uint64 chainSelector) external payable {
        address playerId = _msgSender();
        uint256 tokenId = _playerNfts[playerId];

        _burn(tokenId);
        delete _tokenURIs[tokenId];

        // player will be deleted when they transfer the game NFT
        delete _playerNfts[playerId];

        address gameId = address(this);
        string memory uri = _tokenURIs[tokenId];
        Player memory player = _players[playerId];

        bytes memory data = abi.encode(player.name, player.points);

        /** Cross chain transfer function */
        kanvas._transferTo{value: msg.value}(
            chainSelector,
            gameId,
            playerId,
            tokenId,
            uri,
            data
        );
    }

    /** Cross chain receiver callback function */
    function _receiveFrom(
        uint64 /* chainSelector */,
        address /* gameId */,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external override {
        (string memory name, uint256 points) = abi.decode(
            data,
            (string, uint256)
        );

        _mint(playerId, tokenId);
        _tokenURIs[tokenId] = uri;

        // player will be created when they receive the game NFT
        _players[playerId].name = name;
        _players[playerId].points = points;

        _playerNfts[playerId] = tokenId;
    }
}
