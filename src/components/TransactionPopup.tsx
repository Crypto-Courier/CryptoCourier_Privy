import React from 'react';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Transaction } from '@/types/types';

const TransactionPopup: React.FC<Transaction> = ({
    isOpen, 
  onClose, 
  tokenAmount, 
  tokenSymbol, 
  status = 'pending',
  txHash
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-center">
            {status === 'pending' ? 'Processing Transaction' : 
             status === 'success' ? 'Transaction Successful' : 
             'Transaction Failed'}
          </h2>
        </div>

        <div className="flex flex-col items-center space-y-4 p-6">
          <div className="w-16 h-16 flex items-center justify-center">
            {status === 'pending' && (
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="w-12 h-12 text-green-500" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-12 h-12 text-red-500" />
            )}
          </div>
          
          <div className="text-center space-y-2">
            <p className="text-lg">
              {status === 'pending' ? 'Sending' : 
               status === 'success' ? 'Sent' : 
               'Failed to send'}
            </p>
            <p className="text-2xl font-bold">
              {tokenAmount} {tokenSymbol}
            </p>
          </div>

          {status === 'success' && txHash && (
            <div className="text-sm text-gray-500 break-all text-center">
              Transaction Hash:
              <br />
              {txHash}
            </div>
          )}

          {status !== 'pending' && (
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-[#FF336A] text-white rounded-full hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionPopup;