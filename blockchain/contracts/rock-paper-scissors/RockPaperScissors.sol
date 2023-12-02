// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IKanvasAvax} from "../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../interfaces/IKanvasGame.sol";
import {IKanvasInteropGame} from "../interfaces/IKanvasInteropGame.sol";

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract RockPaperScissors is IKanvasGame, IKanvasInteropGame, ERC721 {
    uint8 private constant WIN_NFT_TEMPLATE = 0;
    uint8 private constant LOST_NFT_TEMPLATE = 1;

    uint256 public constant MAX_PROPERTIES_LEN = 20;

    uint256 private _tokenId;

    mapping(uint256 => string) private _tokenURIs;
    mapping(address => uint256) private _playerNfts;

    IKanvasAvax private kanvas;

    struct Player {
        string name;
        uint256 points;
        bool created;
    }

    mapping(address => Player) private _players;

    constructor(
        address kanvasRouter
    ) ERC721("RockPaperScissors", "RPS") IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }

    function createPlayer(address playerId, string memory name) external {
        Player storage player = _players[playerId];
        require(!player.created, "Player has been created");

        player.name = name;
        player.created = true;
    }

    function upgradePlayer(address playerId) external {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");

        player.points = player.points + 5;

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);

        string memory fields = "$player_name$ $player_points$";

        kanvas._generateUri(playerId, properties, fields, WIN_NFT_TEMPLATE);
    }

    function downgradePlayer(address playerId) external {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");
        require(player.points >= 5, "Already defeated :)");

        player.points = player.points - 5;

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);

        string memory fields = "$player_name$ $player_points$";

        kanvas._generateUri(playerId, properties, fields, LOST_NFT_TEMPLATE);
    }

    function transferTo(uint64 chainSelector) external {
        address playerId = _msgSender();
        uint256 tokenId = _playerNfts[playerId];

        _burn(tokenId);
        delete _tokenURIs[tokenId];

        delete _playerNfts[playerId];

        address gameId = address(this);
        string memory uri = _tokenURIs[tokenId];
        Player memory player = _players[playerId];

        bytes memory data = abi.encode(player.name, player.points);

        kanvas._transferTo(chainSelector, gameId, playerId, tokenId, uri, data);
    }

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

        _players[playerId].name = name;
        _players[playerId].points = points;

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
