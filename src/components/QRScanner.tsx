import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

interface QRScannerProps {
  onScan: (address: string) => void;
  onClose: () => void;
}

interface QRResult {
  text: string;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string>("");

  const handleScan = (result: QRResult | null): void => {
    if (result) {
      // Validate if the scanned result is an Ethereum address
      const address = result.text.split('ethereum:')[1];
      const addressRegex = /^0x[a-fA-F0-9]{40}$/;

      if (address && addressRegex.test(address)) {
        onScan(address); // Pass only the Ethereum address
        onClose();
      } else {
        setError("Invalid wallet address QR code");
      }
    }
  };

  const handleError = (err: Error): void => {
    console.error(err);
    setError("Error accessing camera");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg w-full max-w-sm mx-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scan QR Code
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Position the QR code within the frame
          </p>
        </div>

        <div className="relative">
          <QrReader
            constraints={{
              facingMode: "environment",
            }}
            onResult={(result) =>
              result && handleScan(result as any as QRResult)
            }
            className="w-full"
            scanDelay={500}
          />
          {error && (
            <div className="mt-2 text-red-500 text-sm text-center">{error}</div>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
