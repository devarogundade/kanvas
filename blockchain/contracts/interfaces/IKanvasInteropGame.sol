// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

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
