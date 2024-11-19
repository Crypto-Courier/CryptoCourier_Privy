import React, { useRef, useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onAddressFound: (address: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onAddressFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  const initializeScanner = () => {
    if (!scannerInitialized) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1,
          showTorchButtonIfSupported: true,
        },
        false
      );
      scannerRef.current = scanner;
      setScannerInitialized(true);
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    if (scannerRef.current) {
      scannerRef.current.render(onScanSuccess, onScanError);
      console.log("Scanner started");
    }
  };

  const onScanSuccess = (decodedText: string) => {
    console.log('Raw scan result:', decodedText);
    let address = decodedText;

    // Handle ethereum: prefix if present
    if (decodedText.toLowerCase().startsWith('ethereum:')) {
      address = decodedText.split('ethereum:')[1];
    }

    // Validate Ethereum address
    if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
      console.log('Valid Ethereum address found:', address);
      onAddressFound(address);
      toast.success('Valid address found!');
      stopScanning();
    } else {
      console.error('Invalid Ethereum address format:', address);
      toast.error('Invalid Ethereum address in QR code');
    }
  };

  const onScanError = (error: any) => {
    console.warn(`QR Scan error: ${error}`);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
      setIsScanning(false);
    }
  };

  useEffect(() => {
    initializeScanner();
    
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (isScanning) {
      startScanning();
    }
  }, [isScanning]);

  return (
    <div className="qr-scanner-container relative">
      <div id="qr-reader" className={`${!isScanning ? 'hidden' : ''}`} />
      
      {isScanning ? (
        <button
          onClick={stopScanning}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 absolute top-2 right-2"
        >
          ✕
        </button>
      ) : (
        <button
          onClick={() => setIsScanning(true)}
          className="px-4 py-2 rounded-md hover:opacity-80 transition-colors bg-[#FF336A] text-white"
        >
          Scan QR
        </button>
      )}
    </div>
  );
};

export default QRScanner;
