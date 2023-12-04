// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IKanvasAvax} from "../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../interfaces/IKanvasGame.sol";
import {IKanvasInteropGame} from "../interfaces/IKanvasInteropGame.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract RockPaperScissors is IKanvasGame, IKanvasInteropGame, ERC721, Ownable {
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
    ) ERC721("RockPaperScissors", "RPS") IKanvasGame() Ownable() {
        kanvas = IKanvasAvax(kanvasRouter);
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        Player storage player = _players[to];
        // check if receiver has their own account
        require(!player.created, "Player has their own account");

        _playerNfts[to] = tokenId;

        player.name = _players[from].name;
        player.points = _players[from].points;

        // delete send accounts
        delete _playerNfts[from];
        delete _players[from];

        super._transfer(from, to, tokenId);
    }

    function createPlayer(address playerId, string memory name) external {
        Player storage player = _players[playerId];
        require(!player.created, "Player has been created");

        player.name = name;
        player.points = 5;
        player.created = true;

        string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = Strings.toString(player.points);

        string memory fields = "$name$ $points$";

        kanvas._generateUri(playerId, properties, fields, WIN_NFT_TEMPLATE);
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

        string memory fields = "$name$ $points$";

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

        string memory fields = "$name$ $points$";

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

    function _receiveUri(
        address playerId,
        string memory uri
    ) external override {
        uint256 tokenId = _playerNfts[playerId];

        // this player does not have the game nft
        if (tokenId == 0) {
            _tokenId++;

            // mint the game Nft for player
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
