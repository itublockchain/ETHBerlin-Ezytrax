// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract OrderBook {
    struct Order {
        address owner;
        uint256 amount;
        uint256 btcAmount;
        bytes bitcoinAddress;
        bytes nullifier;
    }

    mapping(bytes32 => Order) public orders;

    function addOrder(
        bytes32 orderId,
        address owner,
        uint256 amount,
        uint256 btcAmount,
        bytes memory bitcoinAddress,
        bytes memory nullifier
    ) public {
        Order memory order = Order(
            owner,
            amount,
            btcAmount,
            bitcoinAddress,
            nullifier
        );
        orders[orderId] = order;
    }
}
