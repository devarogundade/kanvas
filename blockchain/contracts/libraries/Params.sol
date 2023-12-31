// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

library Params {
    struct Game {
        string name;
        string description;
        address gameId;
        string avatar;
        uint256 plan;
        string email;
        string website;
    }

    struct InteropGame {
        address sourceGameId;
    }

    struct Plan {
        string name;
        uint256 cost;
        string color;
        uint256 limit;
    }
}
