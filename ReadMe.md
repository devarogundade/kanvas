# Kanvas | Create Runtime Customizable NFTs

## Extend the IKanvasGame
```solidity
contract RockPaperScissors is IKanvasGame {
IKanvasAvax private kanvas;
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```

## Include the IKanvasInteropGame for a cross-chain game
```solidity
contract RockPaperScissors is IKanvasGame, IKanvasInteropGame {
IKanvasAvax private kanvas;
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
string[] memory properties = new string[](MAX_PROPERTIES_LEN);
        properties[0] = player.name;
        properties[1] = player.points;

 string memory fields = "$name$ $points$";

 kanvas._generateUri(playerId, properties, fields, WIN_NFT_TEMPLATE);
```
