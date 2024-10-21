"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { useWallet } from "../../context/WalletContext";
import Image from "next/image";
import trx from "../../assets/trx.png";
import { sendEmail } from "../../components/Email/Emailer";
import { renderEmailToString } from "../../components/Email/renderEmailToString";
import { Transaction } from "../../types/types";
import toast from "react-hot-toast";
import loader from "../../assets/loading.gif";

const TxHistory: React.FC = () => {
  const router = useRouter();
  const { walletData } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingTxId, setLoadingTxId] = useState<number | null>(null);
  const { theme } = useTheme();

  const isConnected = walletData?.authenticated;
  const activeAddress = walletData?.address;

  // Condition routing to send token page
  const SendToken = () => {
    if (isConnected) {
      router.push("/send-token");
    } else {
      alert(
        "Please connect your wallet or log in to gift tokens to your friend."
      );
    }
  };

  // useEffect to fetch the transaction detail from database
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!activeAddress) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/get-transactions?walletAddress=${activeAddress}&chainId=${
            walletData?.chainId.split(":")[1]
          }`
        );
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
  }, [activeAddress]);

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

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
      setLoadingTxId(null); // Reset the loading state once done
    }
  };

  // Skeleton Laoding
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

  return (
    <div className="main">
      <Navbar />

      <div className="txbg ">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px] ">
          <div
            className={`flex justify-end sm:justify-end md:justify-between  lg:justify-between border-black border-b-0 p-[30px] shadow-lg ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`hidden lg:flex md:flex sm:hidden flex items-center space-x-3 p-2 rounded-[10px] ${
                theme === "dark"
                  ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                  : "bg-[#F4F3F3] border border-[#C6C6C6]"
              }`}
            >
              <div
                className={`hidden lg:flex md:flex sm:hidden  w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${
                  theme === "dark"
                    ? "border-white bg-transparent"
                    : "border-gray-500 bg-transparent"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    theme === "dark"
                      ? "bg-[#FFE500] text-[#363535]"
                      : "bg-[#E265FF] text-white"
                  }`}
                ></div>
              </div>
              <span className="hidden lg:flex md:flex sm:hidden  font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {activeAddress
                  ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
                  : "Connect or Login"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <div></div>
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
                onClick={SendToken}
              >
                GIFT TOKEN
              </button>
            </div>
          </div>

          <div
            className={`  ${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start `}
          >
            <div className="space-y-3 text-[12px] lg:text-[13px] md:text-[13px] sm:text-[13px]">
              <h3
                className={` font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] pt-6 px-3 lg:p-0 md:p-0 sm:p-0 ${
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
                    <div className="text-red-700 h-[40vh] flex justify-center items-center text-[15px] lg:text-[20px]  md:text-[20px] sm:text-[20px] font-semibold">
                      No transactions found for your wallet address.
                    </div>
                  ) : transactions.length === 0 ? (
                    <p>No transactions found for your wallet address.</p>
                  ) : (
                    transactions.map((tx, index) => (
                      <div
                        key={index}
                        className={`flex flex-col lg:flex-row md:flex-row sm:flex-col justify-between items-start bg-opacity-50 p-3 rounded-xl mt-2 mx-3 gap-[20px] lg:gap-0 md:gap-0 sm:gap-[20px]  ${
                          theme === "dark"
                            ? "bg-[#000000]/20 border border-[#5C5C5C]"
                            : "bg-[#FFFCFC]/20 border border-[#FFFFFF]"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`rounded-[10px] text-[15px] ${
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
                                className={`rounded-[10px] text-[15px] tracking-wide ${
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
                                className={`rounded-[10px] text-[15px] tracking-wide  ${
                                  theme === "dark"
                                    ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                                    : "border border-[#0052FF] text-[#0052FF] bg-white py-1 px-2"
                                }`}
                              >
                                {`${tx.senderWallet.slice(
                                  0,
                                  15
                                )}...${tx.senderWallet.slice(-4)}`}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex gap-3">
                          {tx.senderWallet === activeAddress && (
                            <div className="resend bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex items-center gap-2">
                              {loadingTxId === index ? (
                                <Image
                                  src={loader}
                                  alt="Loading..."
                                  className="w-6 h-6"
                                />
                              ) : (
                                <button
                                  onClick={() => handleResend(tx, index)} // Pass the index to identify transaction
                                  className="tracking-wide text-[15px] "
                                >
                                  Resend
                                </button>
                              )}
                            </div>
                          )}
                          <div className="trx bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-3 py-2 rounded-full text-[12px] flex  gap-2 justify-center  items-center">
                            <Image
                              src={trx}
                              alt=""
                              gap-2
                              className="w-4 h-4 lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-4 sm:h-4"
                            />
                            <button
                              className="tracking-wide text-[15px] "
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
                    className={`text-center font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] h-[40vh] flex justify-center items-center text-[20px] ${
                      theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                    }`}
                  >
                    Connect your wallet to view your transactions.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
export default TxHistory;
