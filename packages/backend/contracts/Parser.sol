// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
@title Bitcoin Transaction Parser
@dev Parses a Bitcoin transaction and extracts the OP_RETURN output
*/
contract BitcoinTxParser {
    struct BitcoinTransaction {
        string opReturnData; // Data from OP_RETURN output as a string
    }

    /*
    @notice Parses a Bitcoin transaction and extracts the OP_RETURN output
    @param _tx The Bitcoin transaction to parse
    @return parsedTx The parsed transaction containing only the OP_RETURN data
    */
    function parseTransaction(
        bytes memory _tx
    ) public pure returns (BitcoinTransaction memory) {
        BitcoinTransaction memory parsedTx;

        // Start after version (4 bytes) and SegWit marker & flag (2 bytes)
        uint offset = 6;

        // Skip the input count and input data (assuming fixed size for this example)
        offset += 1 + 41;

        // Read the number of outputs
        uint8 outputCount = uint8(_tx[offset]);
        offset += 1;

        // Iterate through outputs to find OP_RETURN output
        for (uint i = 0; i < outputCount; i++) {
            uint256 value;
            (value, offset) = readUint64(_tx, offset);

            uint scriptLen;
            (scriptLen, offset) = readVarInt(_tx, offset);

            // Check if this output is OP_RETURN
            if (_tx[offset] == 0x6a) {
                offset += 1; // Skip OP_RETURN opcode (0x6a)

                // Ensure that the length is sufficient to extract the OP_RETURN data
                require(
                    offset + scriptLen - 1 <= _tx.length,
                    "OP_RETURN data is out of bounds"
                );

                // Extract OP_RETURN data (subtract 1 to exclude the OP_RETURN opcode)
                bytes memory opReturnBytes = slice(_tx, offset, scriptLen - 1);
                parsedTx.opReturnData = convertBytesToHexString(opReturnBytes);

                break;
            } else {
                offset += scriptLen;
            }
        }

        return parsedTx;
    }

    // Helper functions...

    function readVarInt(
        bytes memory data,
        uint offset
    ) internal pure returns (uint, uint) {
        require(data.length >= offset + 1, "Data out of bounds");
        return (uint(uint8(data[offset])), offset + 1);
    }

    function readUint64(
        bytes memory data,
        uint offset
    ) internal pure returns (uint256, uint) {
        require(data.length >= offset + 8, "Data out of bounds");
        uint256 value;
        for (uint i = 0; i < 8; i++) {
            value |= uint256(uint8(data[offset + i])) << (8 * i);
        }
        return (value, offset + 8);
    }

    function slice(
        bytes memory data,
        uint start,
        uint length
    ) internal pure returns (bytes memory) {
        bytes memory part = new bytes(length);
        for (uint i = 0; i < length; i++) {
            part[i] = data[i + start];
        }
        return part;
    }

    function convertBytesToHexString(
        bytes memory data
    ) internal pure returns (string memory) {
        bytes memory hexChars = "0123456789abcdef";
        bytes memory result = new bytes(data.length * 2); // Each byte is "xx" format

        for (uint i = 0; i < data.length; i++) {
            result[2 * i] = hexChars[uint8(data[i] >> 4)];
            result[2 * i + 1] = hexChars[uint8(data[i] & 0x0f)];
        }

        return string(result);
    }
}
