export const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "allReels",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "address",
        name: "uploadedBy",
        type: "address",
      },
      {
        internalType: "string",
        name: "uploaderUsername",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isDerivative",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllReels",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "address",
            name: "uploadedBy",
            type: "address",
          },
          {
            internalType: "string",
            name: "uploaderUsername",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isDerivative",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "image",
                type: "string",
              },
              {
                internalType: "string",
                name: "link",
                type: "string",
              },
            ],
            internalType: "struct ReelPlatform.Song[]",
            name: "derivativeSongs",
            type: "tuple[]",
          },
        ],
        internalType: "struct ReelPlatform.Reel[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserProfile",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "username",
            type: "string",
          },
          {
            internalType: "string",
            name: "profileImage",
            type: "string",
          },
        ],
        internalType: "struct ReelPlatform.User",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserReels",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsHash",
            type: "string",
          },
          {
            internalType: "string",
            name: "title",
            type: "string",
          },
          {
            internalType: "address",
            name: "uploadedBy",
            type: "address",
          },
          {
            internalType: "string",
            name: "uploaderUsername",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isDerivative",
            type: "bool",
          },
          {
            components: [
              {
                internalType: "string",
                name: "name",
                type: "string",
              },
              {
                internalType: "string",
                name: "image",
                type: "string",
              },
              {
                internalType: "string",
                name: "link",
                type: "string",
              },
            ],
            internalType: "struct ReelPlatform.Song[]",
            name: "derivativeSongs",
            type: "tuple[]",
          },
        ],
        internalType: "struct ReelPlatform.Reel[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
    ],
    name: "setUserProfile",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "bool",
        name: "isDerivative",
        type: "bool",
      },
      {
        internalType: "string[]",
        name: "songNames",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "songImages",
        type: "string[]",
      },
      {
        internalType: "string[]",
        name: "songLinks",
        type: "string[]",
      },
    ],
    name: "uploadReel",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "userReels",
    outputs: [
      {
        internalType: "string",
        name: "ipfsHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "title",
        type: "string",
      },
      {
        internalType: "address",
        name: "uploadedBy",
        type: "address",
      },
      {
        internalType: "string",
        name: "uploaderUsername",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isDerivative",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "users",
    outputs: [
      {
        internalType: "string",
        name: "username",
        type: "string",
      },
      {
        internalType: "string",
        name: "profileImage",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
