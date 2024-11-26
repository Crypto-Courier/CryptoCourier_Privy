import React from "react";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";

type TransactionPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  tokenAmount: string;
  tokenSymbol: string;
  status: string;
  txHash?: string;
  senderWallet?: string;
  recipientWallet?: string;
  customizedLink?: string;
  recipientEmail?: string;
};

const TransactionPopup: React.FC<TransactionPopupProps> = ({
  isOpen,
  onClose,
  tokenAmount,
  tokenSymbol,
  status,
  txHash,
  senderWallet,
  recipientWallet,
  customizedLink,
  recipientEmail,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md bg-gray-900 text-white rounded-xl shadow-xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-700 text-center">
          <h2 className="text-xl font-semibold">
            {status === "pending"
              ? "Processing Transaction"
              : status === "success"
              ? "Transaction Successful"
              : "Transaction Failed"}
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col space-y-4 items-center">
          {/* Status Icon */}
          <div className="w-16 h-16 flex items-center justify-center">
            {status === "pending" && (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
            {status === "error" && (
              <AlertCircle className="w-12 h-12 text-red-500" />
            )}
          </div>

          {/* Transaction Info */}
          <div className="text-center space-y-2">
            <p className="text-lg">
              {status === "pending"
                ? "Sending"
                : status === "success"
                ? "Sent"
                : "Failed to send"}
            </p>
            <p className="text-2xl font-bold">
              {tokenAmount} {tokenSymbol}
            </p>
          </div>

          {/* Additional Details */}
          {senderWallet && (
            <p className="text-sm text-gray-400 break-all">
              <strong>From:</strong> {senderWallet}
            </p>
          )}
          {recipientWallet && (
            <p className="text-sm text-gray-400 break-all">
              <strong>To:</strong> {recipientWallet}
            </p>
          )}
          {recipientEmail && (
            <p className="text-sm text-gray-400">
              <strong>Recipient Email:</strong> {recipientEmail}
            </p>
          )}
          {customizedLink && (
            <p className="text-sm text-blue-400 break-all">
              <strong>Link:</strong>{" "}
              <a
                href={customizedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {customizedLink}
              </a>
            </p>
          )}
          {status === "success" && txHash && (
            <p className="text-sm text-gray-400 break-all text-center">
              <strong>Transaction Hash:</strong>
              <br />
              {txHash}
            </p>
          )}
        </div>

        {/* Close Button */}
        {status !== "pending" && (
          <div className="px-6 py-4">
            <button
              onClick={onClose}
              className="w-full py-2 bg-[#FF336A] rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPopup;
