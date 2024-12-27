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
export interface Transaction {
  isOpen: boolean;
  onClose: () => void;
  tokenAmount: string;
  tokenSymbol: string;
  status: any;
  txHash: any;
}

export interface WalletProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EmailProps {
  claimerEmail: string;
  tokenAmount: string;
  tokenSymbol: string;
  gifterEmail: string;
  transactionHash: string; 
}

export interface SendEmailParams {
  claimerEmail: string;
  subject: string;
  htmlContent: string;
  tokenAmount: string;
  tokenSymbol: string;
  gifterEmail: string;
  transactionHash: string;
  getAccessToken: any;
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
  senderEmail:string;
  claimed?: boolean;
  authenticated?: boolean;
  chainId : number;
}
export interface ApiResponse {
  id: string;
  created_at: number;
  linked_accounts: LinkedAccount[];
  mfa_methods: any[];
  has_accepted_terms: boolean;
  is_guest: boolean;
}