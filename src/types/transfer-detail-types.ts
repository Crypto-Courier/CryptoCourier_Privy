export interface TransferDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    tokenAmount: string;
    tokenSymbol: string;
    recipientEmail: string;
    recipientAddress: string;
    onConfirm: (walletAddress: string) => void;
    transferType: 'email' | 'eoa';
    isContractCall: boolean;
    chainId: string
  }