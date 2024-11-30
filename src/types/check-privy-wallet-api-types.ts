export interface WalletAccount {
    address: string;
    type: "wallet";
    verifiedAt: string;
    firstVerifiedAt: string;
    latestVerifiedAt: string;
    chainType: "ethereum";
    chainId: string;
    walletClientType: "privy";
    connectorType: "embedded";
    hdWalletIndex: number;
    imported: boolean;
    delegated: boolean;
}