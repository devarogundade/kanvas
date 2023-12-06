// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IKanvasAvax} from "../../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../../interfaces/IKanvasGame.sol";
import {IKanvasInteropGame} from "../../interfaces/IKanvasInteropGame.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract RockPaperScissors is IKanvasGame, IKanvasInteropGame, ERC721, Ownable {
    uint8 private constant WIN_NFT_TEMPLATE = 0;
    uint8 private constant LOST_NFT_TEMPLATE = 1;

    uint256 private _tokenId;

    mapping(uint256 => string) private _tokenURIs;

    IKanvasAvax private kanvas;

    struct Player {
        string name;
        uint256 points;
        uint256 tokenId;
        bool created;
    }

    receive() external payable {}

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
        Player storage newPlayer = _players[to];
        // check if receiver has their own account
        require(!newPlayer.created, "Player has their own account");

        // create new player account
        newPlayer = _players[from];

        // delete sender accounts
        delete _players[from];

        super._transfer(from, to, tokenId);
    }

    function createPlayer(address playerId, string memory name) external {
        Player storage player = _players[playerId];
        require(!player.created, "Player has been created");

        player.name = name;
        player.points = 5;
        player.created = true;

        _tokenId++;
        uint256 tokenId = _tokenId;

        _mint(playerId, tokenId);
        player.tokenId = tokenId;

        string[] memory props = new string[](2);
        props[0] = player.name;
        props[1] = Strings.toString(player.points);

        string memory fields = "$name$ $points$";

        kanvas._generateUri(playerId, props, fields, WIN_NFT_TEMPLATE);
    }

    // Retsrns the player struct
    function getPlayer(address playerId) external view returns (Player memory) {
        return _players[playerId];
    }

    /** Increase player points */
    function upgradePlayer(address playerId) external onlyOwner {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");

        player.points = player.points + 5;

        string[] memory props = new string[](2);
        props[0] = player.name;
        props[1] = Strings.toString(player.points);

        string memory fields = "$name$ $points$";

        kanvas._generateUri(playerId, props, fields, WIN_NFT_TEMPLATE);
    }

    /** Reduce player points */
    function downgradePlayer(address playerId) external onlyOwner {
        Player storage player = _players[playerId];
        require(player.created, "Create this player first");
        require(player.points >= 1, "Already defeated :)");

        player.points = player.points - 1;

        string[] memory props = new string[](2);
        props[0] = player.name;
        props[1] = Strings.toString(player.points);

        string memory fields = "$name$ $points$";

        kanvas._generateUri(playerId, props, fields, LOST_NFT_TEMPLATE);
    }

    /** Bridge game Nft function */
    function transferTo(uint64 chainSelector) external payable {
        address playerId = _msgSender();
        Player memory player = _players[playerId];
        require(player.created, "Player does not exists");

        address gameId = address(this);
        string memory uri = _tokenURIs[player.tokenId];

        bytes memory data = abi.encode(player.name, player.points);

        /** Cross chain transfer function */
        kanvas._transferTo{value: msg.value}(
            chainSelector,
            gameId,
            playerId,
            player.tokenId,
            uri,
            data
        );

        _burn(player.tokenId);
        delete _tokenURIs[player.tokenId];

        // player will be deleted when they transfer the game NFT
        delete _players[playerId];
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
        require(_msgSender() == address(kanvas), "UnAuthorized");

        (string memory name, uint256 points) = abi.decode(
            data,
            (string, uint256)
        );

        _mint(playerId, tokenId);
        _tokenURIs[tokenId] = uri;

        // player will be created when they receive the game NFT
        _players[playerId].name = name;
        _players[playerId].points = points;

        _players[playerId].tokenId = tokenId;
    }

    function _receiveUri(
        address playerId,
        string memory uri
    ) external override {
        require(_msgSender() == address(kanvas), "UnAuthorized");
        _tokenURIs[_players[playerId].tokenId] = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
