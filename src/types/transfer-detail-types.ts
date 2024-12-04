export interface TransferDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    tokenAmount: string;
    tokenSymbol: string;
    recipientEmail: string;
    onConfirm: (walletAddress: string) => void;
    transferType: 'email' | 'eoa';
  }