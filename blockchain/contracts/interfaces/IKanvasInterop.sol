// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Params} from "../libraries/Params.sol";

interface IKanvasInterop {
    event PlanCreated(
        uint256 planId,
        string name,
        uint256 cost,
        string color,
        uint256 limit
    );

    function _transferTo(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable;

    function _generateUri(
        address playerId,
        string[] memory properties,
        string memory fields,
        uint8 templateId
    ) external;

    function _createGame(
        uint64 chainSelector,
        Params.InteropGame memory params
    ) external;
}
