// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IKanvasAvax {
    function _transferTo(
        uint64 chainSelector,
        bytes memory data
    ) external payable;

    function _generateUri(
        address playerId,
        string[] memory properties,
        string memory fields
    ) external;
}
