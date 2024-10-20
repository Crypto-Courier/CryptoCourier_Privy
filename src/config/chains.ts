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
      name: "Sepolia Ether",
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
  11155420: {
    name: "Optimism Sepolia",
    rpcUrl: `https://opt-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Optimism Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://sepolia-optimism.etherscan.io/tx',
  },
  84532: {
    name: "Base Sepolia",
    rpcUrl: `https://base-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Base Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://sepolia.basescan.org/tx',
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
  919: {
    name: "Mode Sepolia",
    rpcUrl: `https://sepolia.mode.network`,
    nativeCurrency: {
      name: "Mode Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://sepolia.explorer.mode.network/tx',
  },
  7777777: {
    name: "Zora",
    rpcUrl: `https://zora-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Zora Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.zora.energy/tx',
  },
  1135: {
    name: "Lisk",
    rpcUrl: `https://rpc.api.lisk.com`,
    nativeCurrency: {
      name: "Lisk",
      symbol: "LSK",
      decimals: 8,
    },
    blockexplorer: 'https://blockscout.lisk.com/tx',
  },    
  291: {
    name: "Orderly",
    rpcUrl: `https://rpc.orderly.network`,
    nativeCurrency: {
      name: "Orderly Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://explorer.orderly.network/tx',
  },
  7560: {
    name: "Cyber",
    rpcUrl: `https://cyber.alt.technology`,
    nativeCurrency: {
      name: "Cyber",
      symbol: "CYBER",
      decimals: 9,
    },
    blockexplorer: 'https://cyberscan.co/tx',
  },
  255: {
    name: "Kroma",
    rpcUrl: `https://api.kroma.network`,
    nativeCurrency: {
      name: "Kroma Ether",
      symbol: "ETH",
      decimals: 18,
    },
    blockexplorer: 'https://blockscout.kroma.network/tx',
  },  
};

export default chainConfig;
