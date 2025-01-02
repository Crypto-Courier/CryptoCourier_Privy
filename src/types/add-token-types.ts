// Token Types for store or retrieve
export interface AddToken {
  chainId: number;
  contractAddress: string;
  name: string;
  symbol: string;
  decimals: number;
}

export interface AddTokenFormProps {
  onClose: () => void;
  onAddToken: (token: AddToken) => void;
}