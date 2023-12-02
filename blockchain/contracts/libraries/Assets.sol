// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library Assets {
    struct Game {
        string name;
        string avatar;
        string description;
        uint256 plan;
        address creator;
    }

    struct Request {
        address gameId;
        address playerId;
        bool fulfilled;
    }

    struct Plan {
        string name;
        uint256 cost;
        string color;
        uint256 limit;
    }
}
