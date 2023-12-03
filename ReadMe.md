# Kanvas | Create Runtime Customizable NFTs

## Extend the IKanvasGame
```solidity
contract RockPaperScissors is IKanvasGame {
   constructor(address kanvasRouter) IKanvasGame() {
        kanvas = IKanvasAvax(kanvasRouter);
    }
}
```
