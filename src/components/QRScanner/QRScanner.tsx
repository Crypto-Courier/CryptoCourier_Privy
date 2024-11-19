import React, { useRef, useState, useEffect } from 'react';
import QrScanner from 'qr-scanner';
import { toast } from 'react-hot-toast';

interface QRScannerProps {
  onAddressFound: (address: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onAddressFound }) => {
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const startScanning = () => {
    setIsScanning(true);
    if (videoRef.current) {
      scannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleScanResult(result.data);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      scannerRef.current.start()
        .then(() => {
          console.log('Scanner started');
          toast.success('Camera started. Please show QR code.');
        })
        .catch((err) => {
          console.error('Failed to start scanner:', err);
          toast.error('Failed to start camera');
          setError('Failed to start camera');
        });
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScanResult = (result: string) => {
    console.log('Raw scan result:', result);
    let address = result;

    // Handle ethereum: prefix if present
    if (result.toLowerCase().startsWith('ethereum:')) {
      address = result.split('ethereum:')[1];
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="qr-scanner-container">
      {isScanning ? (
        <div className="relative">
          <video 
            ref={videoRef} 
            className="w-[300px] h-[300px] object-cover"
          />
          <button
            onClick={stopScanning}
            className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white rounded-md"
          >
            Close
          </button>
        </div>
      ) : (
        <button
          onClick={startScanning}
          className="px-4 py-2 rounded-md hover:opacity-80 transition-colors bg-[#FF336A] text-white"
        >
          Scan QR
        </button>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default QRScanner;
