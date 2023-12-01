// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

library StringJoiner {
    function joinStrings(
        string[] memory strings,
        string memory delimiter
    ) public pure returns (string memory) {
        require(strings.length > 0, "Input array must not be empty");

        uint totalLength = 0;

        // Calculate the total length of the joined string
        for (uint i = 0; i < strings.length; i++) {
            totalLength += bytes(strings[i]).length;
        }

        // Add space for delimiters
        totalLength += (strings.length - 1) * bytes(delimiter).length;

        // Create a buffer for the joined string
        bytes memory result = new bytes(totalLength);
        uint offset = 0;

        // Concatenate the strings with the delimiter
        for (uint i = 0; i < strings.length; i++) {
            bytes memory strBytes = bytes(strings[i]);

            for (uint j = 0; j < strBytes.length; j++) {
                result[offset] = strBytes[j];
                offset++;
            }

            // Add delimiter if not the last element
            if (i < strings.length - 1) {
                bytes memory delimiterBytes = bytes(delimiter);
                for (uint j = 0; j < delimiterBytes.length; j++) {
                    result[offset] = delimiterBytes[j];
                    offset++;
                }
            }
        }

        return string(result);
    }
}
