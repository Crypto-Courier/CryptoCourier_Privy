"use client";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useWallet } from "../context/WalletContext";
import Image from "next/image";
import trx from "../assets/trx.png";
import { sendEmail } from "./Email/Emailer";
import { renderEmailToString } from "./Email/renderEmailToString";
import { Transaction } from "../types/types";
import toast from "react-hot-toast";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { isValidEmail } from "../lib/validation";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
interface TransactionTableProps {
  viewMode: string;
  selectedChains: number[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  viewMode,
  selectedChains
}) => {
  const { walletData } = useWallet();
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  const [loadingTxId, setLoadingTxId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useTheme();

  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle search visibility
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);

    // Focus on input when opened
    if (!isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ensure the click is outside the search input and toggle button
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.prevent-search-close')
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);


  const isConnected =
    viewMode === "dashboard" ? true : walletData?.authenticated;
  const dashboardAddress = searchParams.get("address");
  const activeAddress =
    viewMode === "dashboard" ? dashboardAddress : walletData?.address;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!activeAddress) return;

      setIsLoading(true);
      setError(null);

      try {
        const chainsToQuery = selectedChains;

        const chainIdQuery = chainsToQuery.map(id => `chainId=${id}`).join("&");

        const endpoint = `/api/get-transactions?walletAddress=${activeAddress}&${chainIdQuery}`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }

        const data: Transaction[] = await response.json();

        setTransactions(data);
        setAllTransactions(data);
      } catch (err: any) {
        console.error("Error fetching transactions:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred");
        setTransactions([]);
        setAllTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchTransactions();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [activeAddress, viewMode, selectedChains]);

  // Search functionality
  const performSearch = (term: string) => {
    if (!term) {
      setTransactions(allTransactions);
      return;
    }

    const lowercaseTerm = term.toLowerCase();
    const filteredTransactions = allTransactions.filter(tx =>
      tx.tokenSymbol.toLowerCase().includes(lowercaseTerm) ||
      tx.recipientEmail.toLowerCase().includes(lowercaseTerm) ||
      tx.senderWallet.toLowerCase().includes(lowercaseTerm) ||
      tx.tokenAmount.toString().includes(lowercaseTerm)
    );

    setTransactions(filteredTransactions);
  };

  // Handle search term changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setTransactions(allTransactions);
  };

  // Render search input with animation
  const renderSearchInput = () => {
    return (
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <div className="relative mt-2">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={`w-full px-10 py-2 rounded-lg focus:outline-none transition-all duration-300 ${theme === "dark"
                  ? "bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-2 focus:ring-[#FE660A]"
                  : "bg-gray-100 text-black placeholder-gray-500 focus:ring-2 focus:ring-[#0052FF]"
                  }`}
              />
              {searchTerm && (
                <X
                  size={20}
                  onClick={clearSearch}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 ${theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"
                    }`}
                />
              )}
              <Search
                size={20}
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // Resend email
  const handleResend = async (tx: Transaction, index: number) => {

    if (!isValidEmail(tx.recipientEmail)) {
      toast.error("Invalid email address to send email");
      return;
    }
    setLoadingTxId(index);
    try {
      const subject =
        "Nothing to worry! Your Crypto token is in your inbox again 📩";
      const htmlContent = renderEmailToString({
        recipientEmail: tx.recipientEmail,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
        senderIdentifier: tx.senderIdentifier,
      });

      await sendEmail({
        recipientEmail: tx.recipientEmail,
        subject,
        htmlContent,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
        senderIdentifier: tx.senderIdentifier,
      });
      toast.success("Email resent successfully!");
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setLoadingTxId(null);
    }
  };

  // Skeleton Loading
  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-opacity-50 p-3 rounded-xl border border-gray-300"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-24 bg-gray-300 rounded-[10px]"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded-[10px]"></div>
          </div>
          <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  return (
    <div>
      <div className="space-y-3 text-[12px] lg:text-[13px] md:text-[13px] sm:text-[13px]">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-3 lg:px-0 md:px-0 sm:px-0 relative">
          <h3
            className={`font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] px-3 lg:p-0 md:p-0 sm:p-0 ${theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
              }`}
          >
            Transaction history
          </h3>
          {/* Search Toggle for Large Devices */}
          <div className="prevent-search-close hidden sm:flex items-center space-x-2">
            {renderSearchInput()}
            <button
              onClick={toggleSearch}
              className={`search-toggle p-2 rounded-full transition-colors duration-300 ${isSearchOpen
                ? (theme === "dark"
                  ? "bg-[#FE660A]/20 text-[#FE660A]"
                  : "bg-[#0052FF]/20 text-[#0052FF]")
                : (theme === "dark"
                  ? "hover:bg-[#FE660A]/20 hover:text-[#FE660A]"
                  : "hover:bg-[#0052FF]/20 hover:text-[#0052FF]")
                }`}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Search Toggle for Small Devices */}
          <div className="prevent-search-close sm:hidden w-full">
            <div className="flex items-center space-x-2 w-full">
              <button
                onClick={toggleSearch}
                className={`search-toggle p-2 rounded-full transition-colors duration-300 ${isSearchOpen
                  ? (theme === "dark"
                    ? "bg-[#FE660A]/20 text-[#FE660A]"
                    : "bg-[#0052FF]/20 text-[#0052FF]")
                  : (theme === "dark"
                    ? "hover:bg-[#FE660A]/20 hover:text-[#FE660A]"
                    : "hover:bg-[#0052FF]/20 hover:text-[#0052FF]")
                  }`}
              >
                {isSearchOpen ? <X size={20} /> : <Search size={20} />}
              </button>
            </div>
            {renderSearchInput()}
          </div>
        </div>
        <div className="h-[40vh] overflow-y-auto scroll">
          {isConnected ? (
            isLoading ? (
              <SkeletonLoader />
            ) : error ? (
              <div className="text-red-700 h-[40vh] flex justify-center items-center text-[15px] lg:text-[20px] md:text-[20px] sm:text-[20px] font-semibold">
                No transactions found for your wallet address.
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-red-700 h-[40vh] flex justify-center items-center text-[15px] lg:text-[20px] md:text-[20px] sm:text-[20px] font-semibold">
                No transactions found for your wallet address.
              </div>
            ) : (
              transactions.map((tx, index) => (
                <div
                  key={index}
                  className={`flex flex-col lg:flex-row md:flex-row sm:flex-col justify-between items-start bg-opacity-50 p-3 rounded-xl mt-2 mx-3 gap-[20px] lg:gap-0 md:gap-0 sm:gap-[20px] ${theme === "dark"
                    ? "bg-[#000000]/20 border border-[#5C5C5C]"
                    : "bg-[#FFFCFC]/20 border border-[#FFFFFF]"
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`rounded-[10px] text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] ${theme === "dark"
                        ? "border border-[#FE660A] text-[#FE660A] bg-[#181818] py-1 px-2"
                        : "border border-[#FE660A] text-[#FE660A] bg-white py-1 px-2"
                        }`}
                    >
                      {tx.tokenAmount} {tx.tokenSymbol}
                    </span>
                    {tx.senderWallet === activeAddress ? (
                      <>
                        <span className="text-[15px]">To</span>
                        <span
                          className={`rounded-[10px] text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] tracking-wide ${theme === "dark"
                            ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                            : "border border-[#0052FF] text-[#0052FF] bg-white py-1 px-2"
                            }`}
                        >
                          {tx.recipientEmail}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-[15px]">From</span>
                        <span
                          className={`rounded-[10px] tracking-wide text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] ${theme === "dark"
                            ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                            : "border border-[#0052FF] text-[#0052FF] bg-white py-1 px-2"
                            }`}
                        >
                          {`${tx.senderWallet.slice(
                            0,
                            6
                          )}...${tx.senderWallet.slice(-4)}`}
                        </span>
                      </>
                    )}
                  </div>
                  <div className="justify-end flex gap-3">
                    {tx.senderWallet === activeAddress && isValidEmail(tx.recipientEmail) && (
                      <div className="resend bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[11px] lg:text-[15px] md:text-[15px] flex items-center gap-2 justify-center">
                        {loadingTxId === index ? (
                          <div className="tracking-wide text-[15px]">
                            Sending
                          </div>
                        ) : (
                          <button
                            onClick={() => handleResend(tx, index)}
                            className="tracking-wide text-[15px]"
                          >
                            Resend
                          </button>
                        )}
                      </div>
                    )}
                    <div className="trx bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-3 py-2 rounded-full text-[11px] lg:text-[15px] md:text-[15px] flex gap-2 justify-center items-center">
                      <Image
                        src={trx}
                        alt=""
                        className="w-4 h-4 lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-4 sm:h-4"
                      />
                      <button
                        className="tracking-wide text-[15px]"
                        onClick={() =>
                          openTransactionReciept(tx.customizedLink)
                        }
                      >
                        View Tx
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
          ) : (
            <div
              className={`text-center  lg:text-[20px] md:text-[20px] sm:text-[20px] h-[40vh] flex justify-center items-center text-[20px] ${theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
            >
              Connect your wallet to view your transactions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;