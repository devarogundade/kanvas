// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IKanvasAvax} from "./IKanvasAvax.sol";
import {Params} from "../libraries/Params.sol";

interface IKanvasInterop is IKanvasAvax {
    function _transferTo(
        uint64 chainSelector,
        address gameId,
        address playerId,
        uint256 tokenId,
        string memory uri,
        bytes memory data
    ) external payable;

    function _createGame(
        uint64 chainSelector,
        Params.InteropGame memory params
    ) external;
}
