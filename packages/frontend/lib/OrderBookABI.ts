export const OrderBookABI = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_poolAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ReentrancyGuardReentrantCall',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'btcAmount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'nullifier',
        type: 'bytes32',
      },
    ],
    name: 'OrderAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'commitment',
        type: 'bytes32',
      },
    ],
    name: 'OrderWithdrawn',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_btcAmount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_bitcoinAddress',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: '_nullifier',
        type: 'bytes32',
      },
    ],
    name: 'addOrder',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'commitmentManager',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNextOrderId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256',
      },
    ],
    name: 'getOrder',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'owner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'btcAmount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'orderID',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'bitcoinAddress',
            type: 'string',
          },
          {
            internalType: 'bytes32',
            name: 'nullifier',
            type: 'bytes32',
          },
          {
            internalType: 'bool',
            name: 'isWithdrawn',
            type: 'bool',
          },
        ],
        internalType: 'struct OrderBook.Order',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getUserOrders',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256',
      },
    ],
    name: 'isOrderWithdrawn',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'nextOrderId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'orders',
    outputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'btcAmount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'orderID',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'bitcoinAddress',
        type: 'string',
      },
      {
        internalType: 'bytes32',
        name: 'nullifier',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'isWithdrawn',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolAddress',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_commitmentManager',
        type: 'address',
      },
    ],
    name: 'setCommitmentManager',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_poolAddress',
        type: 'address',
      },
    ],
    name: 'setPoolAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userOrders',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_orderId',
        type: 'uint256',
      },
      {
        internalType: 'bytes32',
        name: '_commitment',
        type: 'bytes32',
      },
    ],
    name: 'withdrawOrder',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
