// SPDX-License-Identifier: MIT
/* 
THIS CONTRACT ONLY FOR TEST PORPUSES
DO NOT USE IN PRODUCTION
 */
pragma solidity ^0.8.0;

contract MockTornadoCash {
    // A mapping to store deposits
    mapping(bytes32 => bool) public deposits;
    // A mapping to store used nullifiers to prevent double-spending
    mapping(bytes32 => bool) public nullifiers;
    // Address of the contract owner
    address public owner;

    event Deposit(bytes32 indexed commitment, uint256 amount);
    event Withdrawal(address indexed to, bytes32 nullifier, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    // Deposit function
    function deposit(bytes32 commitment) external payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");
        require(!deposits[commitment], "Commitment already exists");

        deposits[commitment] = true;
        emit Deposit(commitment, msg.value);
    }

    // Withdraw function
    function withdraw(
        address payable to,
        bytes32 nullifier,
        uint256 amount
    ) external onlyOwner {
        require(!nullifiers[nullifier], "Nullifier already used");
        require(
            address(this).balance >= amount,
            "Insufficient contract balance"
        );

        nullifiers[nullifier] = true;
        to.transfer(amount);

        emit Withdrawal(to, nullifier, amount);
    }

    // Function to check contract balance (for testing purposes)
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
