"use client";
import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useWallet } from "../context/WalletContext";
import Image from "next/image";
import trx from "../assets/trx.png";
import { sendEmail } from "./Email/Emailer";
import { renderEmailToString } from "./Email/renderEmailToString";
import { Transaction } from "../types/types";
import toast from "react-hot-toast";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

interface TransactionTableProps {
  viewMode: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({ viewMode }) => {
  const { walletData } = useWallet();
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  const [loadingTxId, setLoadingTxId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { theme } = useTheme();

  const isConnected =
    viewMode === "dashboard" ? true : walletData?.authenticated;
  const dashboardAddress = searchParams.get("address");
  const activeAddress =
    viewMode === "dashboard" ? dashboardAddress : walletData?.address;

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!activeAddress) return;

      setIsLoading(true);
      try {
        const endpoint =
          viewMode === "dashboard"
            ? `/api/get-dashboard-transaction?walletAddress=${activeAddress}`
            : `/api/get-transactions?walletAddress=${activeAddress}&chainId=${
                walletData?.chainId.split(":")[1]
              }`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [activeAddress, viewMode, walletData?.chainId]);

  // Resend email
  const handleResend = async (tx: Transaction, index: number) => {
    setLoadingTxId(index);
    try {
      const subject =
        "Nothing to worry! Your Crypto token is in your inbox again 📩";
      const htmlContent = renderEmailToString({
        recipientEmail: tx.recipientEmail,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
      });

      await sendEmail({
        recipientEmail: tx.recipientEmail,
        subject,
        htmlContent,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
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
    <div className="space-y-3 text-[12px] lg:text-[13px] md:text-[13px] sm:text-[13px]">
      <h3
        className={`font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] px-3 lg:p-0 md:p-0 sm:p-0 ${
          theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
        }`}
      >
        Transaction history
      </h3>
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
                className={`flex flex-col lg:flex-row md:flex-row sm:flex-col justify-between items-start bg-opacity-50 p-3 rounded-xl mt-2 mx-3 gap-[20px] lg:gap-0 md:gap-0 sm:gap-[20px] ${
                  theme === "dark"
                    ? "bg-[#000000]/20 border border-[#5C5C5C]"
                    : "bg-[#FFFCFC]/20 border border-[#FFFFFF]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span
                    className={`rounded-[10px] text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] ${
                      theme === "dark"
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
                        className={`rounded-[10px] text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] tracking-wide ${
                          theme === "dark"
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
                        className={`rounded-[10px] tracking-wide text-[11px] lg:text-[15px] md:text-[15px] sm:text-[13px] ${
                          theme === "dark"
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
                  {tx.senderWallet === activeAddress && (
                    <div className="resend bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[11px] lg:text-[15px] md:text-[15px] flex items-center gap-2 justify-center">
                      {loadingTxId === index ? (
                        <div className="tracking-wide text-[15px]">Sending</div>
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
                      onClick={() => openTransactionReciept(tx.customizedLink)}
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
            className={`text-center text-[15px] lg:text-[20px] md:text-[20px] sm:text-[20px] h-[40vh] flex justify-center items-center text-[20px] ${
              theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
            }`}
          >
            Connect your wallet to view your transactions.
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionTable;