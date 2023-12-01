// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IKanvasGame {
    function _receiveFrom(uint64 chainSelector, bytes memory data) external;

    function _receiveUri(address playerId, string memory uri) external;
}
