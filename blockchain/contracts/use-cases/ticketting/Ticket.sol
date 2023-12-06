// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IKanvasAvax} from "../../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../../interfaces/IKanvasGame.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Ticket is IKanvasGame, ERC721, Ownable {
    uint8 private constant BEFORE_NFT_TEMPLATE = 0;
    uint8 private constant AFTER_NFT_TEMPLATE = 1;

    uint256 private _tokenId;

    mapping(address => uint256) private _holders;

    mapping(uint256 => string) private _tokenURIs;

    receive() external payable {}

    IKanvasAvax private kanvas;

    constructor(
        address kanvasRouter
    ) ERC721("Ticket", "TKT") IKanvasGame() Ownable() {
        kanvas = IKanvasAvax(kanvasRouter);
    }

    function issueTicket(
        string memory name,
        address holder
    ) external onlyOwner {
        _tokenId++;
        uint256 tokenId = _tokenId;

        _mint(holder, tokenId);
        _holders[holder] = tokenId;

        string[] memory props = new string[](1);
        props[0] = name;

        string memory fields = "$name$";

        kanvas._generateUri(holder, props, fields, BEFORE_NFT_TEMPLATE);
    }

    function updateTicket(
        string memory name,
        uint256 tokenId
    ) external onlyOwner {
        string[] memory props = new string[](1);
        props[0] = name;

        address holder = _ownerOf(tokenId);
        string memory fields = "$name$";

        kanvas._generateUri(holder, props, fields, AFTER_NFT_TEMPLATE);
    }

    function _receiveUri(address holder, string memory uri) external override {
        require(_msgSender() == address(kanvas), "UnAuthorized");
        _tokenURIs[_holders[holder]] = uri;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
