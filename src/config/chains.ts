interface ChainConfig {
  [chainId: number]: {
    name: string;
    rpcUrl: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
  };
}

const alchemyKey = process.env.ALCHEMY_API_KEY;

const chainConfig: ChainConfig = {
  1: {
    name: "Ethereum Mainnet",
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  },
  11155111: {
    name: "Ethereum Sepolia",
    rpcUrl: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "SepoliaETH",
      decimals: 18,
    },
  },
};

export default chainConfig;
