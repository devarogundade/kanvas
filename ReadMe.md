[![Netlify Status](https://api.netlify.com/api/v1/badges/3a5b3855-181f-4fa8-89f6-66638db01c4f/deploy-status)](https://app.netlify.com/sites/kanvas-constellation/deploys)

# Kanvas | Create Run-Time Customizable NFTs

Unlock boundless creativity in blockchain gaming with Kanvas. Craft dynamic, customizable, cross-chain NFTs effortlessly for gamified blockchain applications.

Learn more at [Devpost](https://devpost.com/software/kanvas-in-game-dynamic-nfts)

## Extend the IKanvasGame

```solidity
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
}
```

## Generate NFT

```solidity
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
```

## Include the YourGame for a cross-chain game

```solidity
contract Ticket is IKanvasGame, IKanvasInteropGame, ERC721, Ownable {
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```

## Bridge NFT

```solidity
/** Bridge game Nft function */
function transferTo(uint64 chainSelector) external payable {
    bytes memory data = abi.encode(player.name, player.points);

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
    uint64 chainSelector,
    address gameId,
    address playerId,
    uint256 tokenId,
    string memory uri,
    bytes memory data
) external override {
    // Your implementation..
}
```

## Create NFT Template

[Kanvas dApp](https://kanvas-constellation.netlify.app)
