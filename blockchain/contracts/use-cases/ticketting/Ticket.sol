// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IKanvasAvax} from "../../interfaces/IKanvasAvax.sol";
import {IKanvasGame} from "../../interfaces/IKanvasGame.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

// This smart contract is used to showcase how a Ticketting Platform
// can integrate Kanvas into their smart contract to mint personalized NFT
// for their users at the smart contract level

contract Ticket is IKanvasGame, ERC721, Ownable {
    // Template Ids from Kanvas dApp

    // Template before the Ticket was used
    uint8 private constant BEFORE_NFT_TEMPLATE = 0;

    // Template after the Ticket has been used
    uint8 private constant AFTER_NFT_TEMPLATE = 1;

    // Tracking NFT tokenId
    uint256 private _tokenId;

    // EOA to <holder object>
    mapping(address => Holder) private _holders;

    // holder object
    struct Holder {
        string name;
        uint256 tokenId;
        bool whiteListed;
    }

    // Associating a NFT metadata URI to each <tokenId>
    mapping(uint256 => string) private _tokenURIs;

    // Associating each <tokenId> to a used boolean
    // to determine if the NFT has been used
    mapping(uint256 => bool) private _usedTokens;

    // This function is necessary for an IKanvasGame
    // Incase this smart contract is overpaying for a service
    // it will be able to receive the overspent native funds
    receive() external payable {}

    // The Kanvas smart contract
    IKanvasAvax private kanvas;

    constructor(
        address kanvasRouter
    ) ERC721("Ticket", "TKT") IKanvasGame() Ownable() {
        // Passing the kanvas deployed address to
        // initialize the kanvas global variable
        kanvas = IKanvasAvax(kanvasRouter);
    }

    // Every holder of this NFT must be whitelist
    // Because we want to associate each EOA to their holder name
    function whiteList(string memory name, address holder) external onlyOwner {
        require(!_holders[holder].whiteListed, "Already WhiteListed");

        // Set the holder properties
        _holders[holder].name = name;
        _holders[holder].whiteListed = true;
    }

    // After whitelisting the contract admin can mint a NFT for
    // the EOA
    function issueTicket(address holder) external payable onlyOwner {
        require(_holders[holder].whiteListed, "Not WhiteListed");

        _tokenId++;
        uint256 tokenId = _tokenId;

        // ERC721 mint function
        _mint(holder, tokenId);

        _holders[holder].tokenId = tokenId;

        string[] memory props = new string[](1);
        props[0] = _holders[holder].name;

        string memory fields = "$name$";

        // get URI generating fee
        uint256 fee = kanvas._generateFee();

        // Calling the Kanvas generate function with properties
        // an aligned fields on the designed template on the Kanvas dApp

        // This will generate a NFT with the holder name using the
        // <before use template>
        kanvas._generateUri{value: fee}(
            holder,
            props,
            fields,
            BEFORE_NFT_TEMPLATE
        );
    }

    // Call this function to mark a Ticket NFT as used
    // Also to regenerate the Ticket NFT metadata with the
    // <after use template>
    function useTicket(uint256 tokenId) external payable onlyOwner {
        address holder = _ownerOf(tokenId);

        string[] memory props = new string[](1);
        props[0] = _holders[holder].name;

        string memory fields = "$name$";

        // We update that this Ticket NFT has been used
        _usedTokens[tokenId] = true;

        // get URI generating fee
        uint256 fee = kanvas._generateFee();

        // Calling the Kanvas generate function with properties
        // an aligned fields on the designed template on the Kanvas dApp

        // This will generate a NFT with the holder name using the
        // <after use template>
        kanvas._generateUri{value: fee}(
            holder,
            props,
            fields,
            AFTER_NFT_TEMPLATE
        );
    }

    // Functionality to transfer Ticket NFT ownership
    // And also regenerating the NFT metadata URI for the new owner
    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override {
        require(_holders[to].whiteListed, "Receiver Not WhiteListed");

        string[] memory props = new string[](1);
        props[0] = _holders[to].name;

        string memory fields = "$name$";

        // we check if the token was used or not
        // to determine the type of template to use
        bool used = _usedTokens[tokenId];

        // get URI generating fee
        uint256 fee = kanvas._generateFee();

        // Calling the Kanvas generate function with properties
        // an aligned fields on the designed template on the Kanvas dApp

        // This will generate a NFT with the holder name using the
        // <after use template> or <after use template>
        kanvas._generateUri{value: fee}(
            to,
            props,
            fields,
            used ? AFTER_NFT_TEMPLATE : BEFORE_NFT_TEMPLATE
        );

        // then we call the underlying ERC721 transfer function
        // to do the Ticket NFT ownership transfer
        super._transfer(from, to, tokenId);
    }

    // This is the callback function that the Kanvas
    // smart contract will call when it has our generated NFT metadata URI
    function _receiveUri(address holder, string memory uri) external override {
        require(_msgSender() == address(kanvas), "UnAuthorized");
        _tokenURIs[_holders[holder].tokenId] = uri;
    }

    // A simple getter function to read a NFT metadata URI
    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}
