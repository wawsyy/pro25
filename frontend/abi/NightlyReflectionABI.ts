
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const NightlyReflectionABI = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "externalEuint32",
          "name": "stressLevel",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint32",
          "name": "achievement",
          "type": "bytes32"
        },
        {
          "internalType": "externalEuint32",
          "name": "mindsetAdjustment",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "stressProof",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "achievementProof",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "mindsetProof",
          "type": "bytes"
        }
      ],
      "name": "addReflection",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getMyReflection",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "stressLevel",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "achievement",
          "type": "bytes32"
        },
        {
          "internalType": "euint32",
          "name": "mindsetAdjustment",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalReflections",
      "outputs": [
        {
          "internalType": "euint32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "hasReflection",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    }
  ]
} as const;

