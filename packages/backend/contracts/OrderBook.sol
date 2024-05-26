// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract OrderBook is ReentrancyGuard {
    address public poolAddress;
    address public commitmentManager;
    address public owner;

    event OrderAdded(
        uint256 amount,
        uint256 btcAmount,
        uint256 indexed orderID,
        bytes32 nullifier
    );

    event OrderWithdrawn(uint256 indexed orderID, bytes32 commitment);

    struct Order {
        address owner;
        uint256 amount;
        uint256 btcAmount;
        uint256 orderID;
        string bitcoinAddress;
        bytes32 nullifier;
        bool isWithdrawn;
    }

    mapping(uint256 => Order) public orders;
    mapping(address => uint256[]) public userOrders;
    mapping(bytes32 => bool) private nullifiers;
    uint256 public nextOrderId;

    modifier uniqueNullifier(bytes32 _nullifier) {
        require(!nullifiers[_nullifier], "Nullifier already used");
        _;
    }

    modifier onlyController() {
        require(
            msg.sender == commitmentManager,
            "Only controller can call this function"
        );
        _;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor(address _poolAddress) {
        poolAddress = _poolAddress;
        owner = msg.sender;
    }

    function addOrder(
        uint256 _btcAmount,
        string memory _bitcoinAddress,
        bytes32 _nullifier
    ) public payable uniqueNullifier(_nullifier) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(_btcAmount > 0, "BTC amount must be greater than 0");

        uint256 orderId = nextOrderId;
        nextOrderId++;

        Order memory order = Order(
            msg.sender,
            msg.value,
            _btcAmount,
            orderId,
            _bitcoinAddress,
            _nullifier,
            false
        );
        orders[orderId] = order;
        userOrders[msg.sender].push(orderId);
        nullifiers[_nullifier] = true;

        emit OrderAdded(msg.value, _btcAmount, orderId, _nullifier);
    }

    function withdrawOrder(
        uint256 _orderId,
        bytes32 _commitment
    ) public nonReentrant onlyController {
        Order storage order = orders[_orderId];
        require(!order.isWithdrawn, "Order is already withdrawn");

        order.isWithdrawn = true;

        // Call the deposit function of the MockTornadoCash contract
        (bool success, ) = poolAddress.call{value: order.amount}(
            abi.encodeWithSignature("deposit(bytes32)", _commitment)
        );
        require(success, "Deposit to pool failed");

        emit OrderWithdrawn(_orderId, _commitment);
    }

    function setCommitmentManager(address _commitmentManager) public onlyOwner {
        commitmentManager = _commitmentManager;
    }

    function setPoolAddress(address _poolAddress) public onlyOwner {
        poolAddress = _poolAddress;
    }

    function getUserOrders(
        address _user
    ) public view returns (uint256[] memory) {
        return userOrders[_user];
    }

    function getOrder(uint256 _orderId) public view returns (Order memory) {
        return orders[_orderId];
    }

    function isOrderWithdrawn(uint256 _orderId) public view returns (bool) {
        return orders[_orderId].isWithdrawn;
    }

    function getNextOrderId() public view returns (uint256) {
        return nextOrderId;
    }
}
