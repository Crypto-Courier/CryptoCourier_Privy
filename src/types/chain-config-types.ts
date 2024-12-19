export interface ChainConfig {
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