// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IKanvasGame} from "./IKanvasGame.sol";

interface IKanvasInteropGame is IKanvasGame {
    function _receiveFrom(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external;
}
