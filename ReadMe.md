# Kanvas | Create Runtime Customizable NFTs

Unlock boundless creativity in blockchain gaming with Kanvas. Craft dynamic, cross-chain NFTs effortlessly for immersive gaming experiences.

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

## Include the YourGame for a cross-chain game
```solidity
contract YourGame is IKanvasGame, YourGame {
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```

## IKanvasGame
```solidity
interface IKanvasGame {
    function _receiveUri(address playerId, string memory uri) external;
}
```

## IKanvasInteropGame
```solidity
interface IKanvasInteropGame {
    function _receiveFrom(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external;
}
```

## Generate NFT
```solidity
uint8 NFT_TEMPLATE = 0;

string[] memory properties = new string[](MAX_PROPERTIES_LEN);
properties[0] = player.name;
properties[1] = player.points;

string memory fields = "$name$ $points$";

kanvas._generateUri(playerId, properties, fields, NFT_TEMPLATE);
```

## Bridge NFT
```solidity
 bytes memory data = abi.encode(player.name, player.points);

 kanvas._transferTo{value: msg.value}(
      chainSelector,
      gameId,
      playerId,
      tokenId,
      uri,
      data
  );
```

See full example [here](https://github.com/devarogundade/kanvas/tree/main/blockchain/contracts/rock-paper-scissors)
