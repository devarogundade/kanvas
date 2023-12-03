// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IKanvasAvax {
    event PlanCreated(
        uint256 planId,
        string name,
        uint256 cost,
        string color,
        uint256 limit
    );

    event GameCreated(
        address gameId,
        string name,
        string description,
        string avatar,
        uint256 plan,
        address creator,
        string email,
        string website
    );

    event TemplateAdded(address gameId, string templateUri);

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
}
