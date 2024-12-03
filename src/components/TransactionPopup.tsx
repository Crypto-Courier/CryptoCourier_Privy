import React from "react";
import { AlertCircle, CheckCircle, Loader2, Copy } from "lucide-react";
import { Transaction } from "@/types/types";
import { motion, AnimatePresence } from "framer-motion";

const TransactionPopup: React.FC<Transaction> = ({
  isOpen,
  onClose,
  tokenAmount,
  tokenSymbol,
  status = "pending",
  txHash,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyHash = () => {
    if (txHash) {
      navigator.clipboard.writeText(txHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusBackground = () => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-blue-400 to-blue-600";
      case "success":
        return "bg-gradient-to-r from-green-400 to-green-600";
      case "error":
        return "bg-gradient-to-r from-red-400 to-red-600";
      default:
        return "bg-gray-500";
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`relative w-full max-w-md mx-auto rounded-3xl shadow-2xl overflow-hidden transform transition-all ${getStatusBackground()}`}
        >
          {/* Status Indicator Header */}
          <div className="absolute top-0 left-0 right-0 h-2 animate-pulse"></div>

          {/* Content Container */}
          <div className="relative bg-white rounded-3xl m-2 overflow-hidden">
            <div className="px-6 py-8 text-center">
              <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                {status === "pending" && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-full h-full text-blue-500" />
                  </motion.div>
                )}
                {status === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <CheckCircle className="w-full h-full text-green-500" />
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ type: "tween" }}
                  >
                    <AlertCircle className="w-full h-full text-red-500" />
                  </motion.div>
                )}
              </div>

              <h2 className="text-2xl font-bold mb-2">
                {status === "pending"
                  ? "Processing Transaction"
                  : status === "success"
                  ? "Transaction Successful"
                  : "Transaction Failed"}
              </h2>

              <div className="text-center space-y-2 mb-4">
                <p className="text-lg">
                  {status === "pending"
                    ? "Sending"
                    : status === "success"
                    ? "Sent"
                    : "Failed to send"}
                </p>
                <p className="text-3xl font-bold text-gray-800">
                  {tokenAmount} {tokenSymbol}
                </p>
              </div>

              {status === "success" && txHash && (
                <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-600 truncate mr-2">
                    {txHash}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCopyHash}
                    className="text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    {copied ? (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-green-500 text-sm"
                      >
                        Copied!
                      </motion.span>
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </motion.button>
                </div>
              )}

              {status !== "pending" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="mt-6 w-full px-6 py-3 bg-[#FF336A] text-white rounded-full hover:bg-[#FF337A] transition-all shadow-lg"
                >
                  Close
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TransactionPopup;
