# Kanvas | Create Runtime Customizable NFTs

Unlock boundless creativity in blockchain gaming with Kanvas. Craft dynamic, cross-chain NFTs effortlessly for immersive gaming experiences.

Learn more at [Devpost](https://devpost.com/software/kanvas-in-game-dynamic-nfts)

## Extend the IKanvasGame
```solidity
contract YourGame is IKanvasGame {
   IKanvasAvax private kanvas;

   constructor(address kanvasRouter) IKanvasGame() {
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
