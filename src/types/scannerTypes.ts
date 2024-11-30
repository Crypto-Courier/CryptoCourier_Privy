export interface QRScannerProps {
    onScan: (address: string) => void;
    onClose: () => void;
}

export interface QRResult {
    text: string;
}