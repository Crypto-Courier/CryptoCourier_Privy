interface ChainConfig {
  [chainId: number]: {
    name: string;
    rpcUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    blockexplorer: string;
  };
}

const alchemyKey = process.env.ALCHEMY_API_KEY;

const chainConfig: ChainConfig = {
  11155111: {
    name: "Ethereum Sepolia",
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer:'https://sepolia.etherscan.io/tx',
  },
  252: {
    name: "Fraxtal",
    rpcUrl: `https://rpc.frax.com`,
    nativeCurrency: {
      name: "Fraxtal Ether",
      symbol: "FRXETH",
      decimals: 18,
    },
    blockexplorer: 'https://fraxscan.com/tx',
  },
  10: {
    name: "Optimism",
    rpcUrl: `https://opt-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https:/optimistic.etherscan.io/tx',
  },
  8453: {
    name: "Base",
    rpcUrl: `https://base-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://basescan.org/tx',
  },  
  42220: {
    name: "Celo",
    rpcUrl: `https://forno.celo.org`,
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.celo.org/mainnet/tx',
  },
  34443: {
    name: "Mode",
    rpcUrl: `https://sepolia.mode.network`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.mode.network/tx',
  },
  7777777: {
    name: "Zora",
    rpcUrl: `https://zora-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.zora.energy/tx',
  },
  1135: {
    name: "Lisk",
    rpcUrl: `https://rpc.api.lisk.com`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://blockscout.lisk.com/tx',
  },    
  291: {
    name: "Orderly",
    rpcUrl: `https://rpc.orderly.network`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.orderly.network/tx',
  },
  7560: {
    name: "Cyber",
    rpcUrl: `https://cyber.alt.technology`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://cyberscan.co/tx',
  },
  255: {
    name: "Kroma",
    rpcUrl: `https://api.kroma.network`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://blockscout.kroma.network/tx',
  },  
  480: {
    name: "WorldChain",
    rpcUrl: `https://worldchain-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://worldscan.org/tx",
  },
  288: {
    name: "Boba Network",
    rpcUrl: "https://mainnet.boba.network",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://bobascan.com/tx",
  },
  185: {
    name: "Mint",
    rpcUrl: "https://asia.rpc.mintchain.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.mintchain.io/tx",
  },
  690: {
    name: "Redstone",
    rpcUrl: "https://rpc.redstonechain.com",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.redstone.xyz/tx",
  },
  360: {
    name: "Shape",
    rpcUrl: "https://mainnet.shape.network",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://shapescan.xyz/tx",
  },
  254: {
    name: "Swan",
    rpcUrl: "https://mainnet-rpc.swanchain.org",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://swanscan.io/tx",
  },
  8866: {
    name: "Superlumio",
    rpcUrl: "https://mainnet.lumio.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.lumio.io/tx",
  },
  1750: {
    name: "MetalL2",
    rpcUrl: "https://rpc.metall2.com",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.metall2.com/tx",
  },
  5112: {
    name: "Ham",
    rpcUrl: "https://rpc.ham.fun",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.ham.fun/tx",
  },
  2192: {
    name: "Snax",
    rpcUrl: "https://mainnet.snaxchain.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://explorer.snaxchain.io/tx",
  },
  888888888: {
    name: "Ancient8",
    rpcUrl: "https://rpc.ancient8.gg",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: "https://scan.ancient8.gg/tx",
  },
};

export default chainConfig;
