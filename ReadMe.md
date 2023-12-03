# Kanvas | Create Runtime Customizable NFTs

## Extend the IKanvasGame
```solidity
contract RockPaperScissors is IKanvasGame {
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```

## Include the IKanvasInteropGame for cross-chain game
```
contract RockPaperScissors is IKanvasGame, IKanvasInteropGame {
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```
