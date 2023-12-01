// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IKanvasAvax} from "../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../interfaces/IKanvasGame.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract RockPaperScissor is IKanvasGame, ERC721 {
    uint256 public constant MAX_PROPERTIES_LEN = 20;

    string[] private _colors;

    uint256 private _tokenId;
    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) private _playerNfts;

    IKanvasAvax private kanvas;

    struct Player {
        string name;
        string color;
        uint256 level;
        uint256 points;
        bool created;
    }

    mapping(address => Player) private _players;

    constructor(
        address router
    ) ERC721("RockPaperScissor", "RPS") IKanvasGame() {
        kanvas = IKanvasAvax(router);
    }

    function createPlayer(address playerId, string memory name) external {
        Player storage player = _players[playerId];
        require(!player.created, "Player has been created");

        player.name = name;
        player.created = true;
        player.color = _colors[0];

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);
        properties[2] = player.color;

        string memory fields = "$name$ $points$ $color$";

        kanvas._generateUri(playerId, properties, fields);
    }

    function upgradePlayer(address playerId) external {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");

        player.level = player.level + 1;
        player.points = player.points + 5;
        player.color = _colors[player.level];

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = Strings.toString(player.points);
        properties[0] = player.color;

        string memory fields = "$points$ $color$";

        kanvas._generateUri(playerId, properties, fields);
    }

    function transferTo(uint64 chainSelector) external {
        address player = _msgSender();
        uint256 tokenId = _playerNfts[player];

        bytes memory data = abi.encode(player, tokenId, _tokenURIs[tokenId]);

        _burn(tokenId);
        delete _tokenURIs[tokenId];

        delete _playerNfts[player];

        kanvas._transferTo(chainSelector, data);
    }

    function _receiveFrom(uint64 chainSelector, bytes memory data) external {
        (address playerId, uint256 tokenId, string memory uri) = abi.decode(
            data,
            (address, uint256, string)
        );

        _mint(playerId, tokenId);
        _tokenURIs[tokenId] = uri;

        _playerNfts[playerId] = tokenId;
    }

    function _receiveUri(address playerId, string memory uri) external {
        uint256 tokenId = _playerNfts[playerId];

        // this player does not have the game nft
        if (tokenId == 0) {
            // mint the game nft for player
            _tokenId++;
            tokenId = _tokenId;

            _mint(playerId, tokenId);

            _playerNfts[playerId] = tokenId;
        }

        _tokenURIs[tokenId] = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
