// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Parser.sol";
import "./OrderBook.sol";
import "./MockTornado.sol";

contract CommitmentManager is ReentrancyGuard {
    BitcoinTxParser public parser;
    OrderBook public orderBook;
    MockTornadoCash public pool;

    constructor(
        address _parserAddress,
        address _orderBookAddress,
        address _poolAddress
    ) {
        parser = BitcoinTxParser(_parserAddress);
        orderBook = OrderBook(_orderBookAddress);
        pool = MockTornadoCash(_poolAddress);
    }

    function handleCommitment(
        uint256 _orderId,
        bytes memory _tx
    ) public nonReentrant {
        // Parse the Bitcoin transaction
        BitcoinTxParser.BitcoinTransaction memory btcTx = parser
            .parseTransaction(_tx);
        bytes32 commitment = keccak256(abi.encodePacked(btcTx.opReturnData));

        // Trigger withdrawal in OrderBook
        orderBook.withdrawOrder(_orderId, commitment);

        // Trigger deposit in MockTornadoCash
        pool.deposit{value: orderBook.getOrder(_orderId).amount}(commitment);
    }
}
