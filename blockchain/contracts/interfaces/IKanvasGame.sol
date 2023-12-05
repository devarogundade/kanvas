// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IKanvasGame {
    function _receiveUri(address playerId, string memory uri) external;
}
