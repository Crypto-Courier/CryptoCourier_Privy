export interface NewToken {
    contractAddress: string;
    name: string;
    symbol: string;
    decimals: number;
}

export interface TokenConfig {
    contractAddress: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface LinkedAccount {
    type: string;
    address: string;
    verified_at: number;
    first_verified_at: number | null;
    latest_verified_at: number | null;
}

export interface TokenWithBalance extends TokenConfig {
    balance: string;
    rawBalance: string;
}

export interface PrivyWrapperProps {
    children: React.ReactNode;
}

export interface TxDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    tokenAmount: string;
    tokenSymbol: string;
    recipientEmail: string;
    onConfirm: (walletAddress: string) => void;
}

export interface WalletProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface EmailProps {
    recipientEmail: string;
    tokenAmount: string;
    tokenSymbol: string;
}

export interface SendEmailParams {
    recipientEmail: string;
    subject: string;
    htmlContent: string;
    tokenAmount: string;
    tokenSymbol: string;
}

export interface TokenDetails {
    name: string;
    symbol: string;
    decimals: number;
}
export interface Transaction {
    senderWallet: string;
    recipientWallet: string;
    tokenAmount: string;
    tokenSymbol: string;
    customizedLink: string;
    recipientEmail: string;
}

export interface AddTokenFormProps {
    onClose: () => void;
    onAddToken: (token: NewToken) => void;
}

export interface ApiResponse {
    id: string;
    created_at: number;
    linked_accounts: LinkedAccount[];
    mfa_methods: any[];
    has_accepted_terms: boolean;
    is_guest: boolean;
}

export interface LeaderboardEntry {
    address: string;
    invites: number;
    claims: number;
  }