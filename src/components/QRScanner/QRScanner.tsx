import React, { useRef, useState, useEffect } from 'react';
import { Html5Qrcode, Html5QrcodeScanType } from 'html5-qrcode';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onAddressFound: (address: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onAddressFound }) => {
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanning = async () => {
    try {
      // Create new scanner instance if not exists
      if (!scannerRef.current) {
        scannerRef.current = new Html5Qrcode("qr-reader");
      }

      // Start scanning with camera
      await scannerRef.current.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanError
      );

      setIsScanning(true);
    } catch (err) {
      console.error("Error starting scanner:", err);
      toast.error("Unable to access camera");
    }
  };

  const onScanSuccess = (decodedText: string) => {
    let address = decodedText;

    // Handle ethereum: prefix if present
    if (decodedText.toLowerCase().startsWith('ethereum:')) {
      address = decodedText.split('ethereum:')[1];
    }

    // Validate Ethereum address
    if (address.match(/^0x[a-fA-F0-9]{40}$/)) {
      onAddressFound(address);
      toast.success('Valid address found!');
      stopScanning();
    } else {
      toast.error('Invalid Ethereum address in QR code');
    }
  };

  const onScanError = (error: any) => {
    // Only log critical errors, ignore routine scan errors
    if (error?.message?.includes('NotFound')) {
      console.warn('QR code not found in frame');
    } else {
      console.error('QR Scan error:', error);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="qr-scanner-container relative">
      <div id="qr-reader" className="relative overflow-hidden rounded-lg" />
      
      <button
        onClick={isScanning ? stopScanning : startScanning}
        className="px-4 py-2 rounded-md hover:opacity-80 transition-colors bg-[#FF336A] text-white"
      >
        {isScanning ? 'Cancel' : 'Send'}
      </button>
    </div>
  );
};

export default QRScanner;