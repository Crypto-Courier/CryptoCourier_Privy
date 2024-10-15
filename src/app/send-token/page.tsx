"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import { Tooltip } from "antd";
import Image from "next/image";
import base from "../../assets/base.png";
import derive from "../../assets/derive.jpeg";
import bitcoin from "../../assets/bitcoin.webp";
import cyfer from "../../assets/cyfer.webp";
import fraxtal from "../../assets/fraxtal.webp";
import kroma from "../../assets/kroma.webp";
import mode from "../../assets/mode.webp";
import op from "../../assets/op.png";
import zora from "../../assets/zora.png";
import lisk from "../../assets/lisk.webp";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAccount, useSendTransaction, useChainId } from "wagmi";
import { parseUnits } from "viem";
import { toast } from "react-hot-toast";
import { Copy, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sendEmail } from "../../components/Email/Emailer";
import Email from "../../components/Email/Email";
import TxDetails from "../../components/TxDetails";
import AddTokenForm from "./AddTokenForm";
import { NewToken, TokenWithBalance } from "../../types/types";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useWallet } from "../../context/WalletContext";

const SendToken = () => {
  const { walletData } = useWallet();
  const { address: walletAddress, isConnected: isWalletConnected } =
    useAccount();
  const {
    user,
    authenticated: isPrivyAuthenticated,
    sendTransaction: privySendTransaction,
  } = usePrivy();
  const [copied, setCopied] = useState(false);
  const chainId = useChainId();
  const router = useRouter();
  const { wallets } = useWallets();
  const { data: hash, sendTransaction: wagmiSendTransaction } =
    useSendTransaction();
  const [tokens, setTokens] = useState<TokenWithBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientWalletAddress, setRecipientWalletAddress] = useState("");
  const [showAddTokenForm, setShowAddTokenForm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [maxAmount, setMaxAmount] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref

  // const isConnected = isWalletConnected || isPrivyAuthenticated;
  const isConnected = walletData?.authenticated;

  const OpenHistory = () => {
    router.push("/transaction-history");
  };

  const getActiveAddress = () => {
    if (walletData?.address) {
      return walletData.address;
    } else if (user?.wallet?.address) {
      return user.wallet.address;
    }
    return null;
  };

  const activeAddress = getActiveAddress();

  // Constantly fetching tokens from the database
  useEffect(() => {
    if (activeAddress) {
      fetchTokens();
    }
  }, [activeAddress]);

  useEffect(() => {
    const selectedTokenData = tokens.find(
      (t) => t.contractAddress === selectedToken
    );
    if (selectedTokenData) {
      setSelectedTokenSymbol(selectedTokenData.symbol);
    }
  }, [tokens, selectedToken]);

  // When hash is available for txn, email should be sent to receiver
  // useEffect(() => {
  //   if (hash) {
  //     const selectedTokenData = tokens.find(
  //       (t) => t.contractAddress === selectedToken
  //     );
  //     if (selectedTokenData) {
  //       const emailContent = renderToString(
  //         <Email
  //           recipientEmail={recipientEmail}
  //           tokenAmount={tokenAmount}
  //           tokenSymbol={selectedTokenData.symbol}
  //         />
  //       );
  //       sendEmail({
  //         recipientEmail,
  //         subject: "Hooray! You got some crypto coin 🪙",
  //         htmlContent: emailContent,
  //         tokenAmount,
  //         tokenSymbol: selectedTokenData.symbol,
  //       });
  //       StoreTransactionData(
  //         recipientWalletAddress,
  //         activeAddress as `0x${string}`,
  //         tokenAmount,
  //         selectedTokenData.symbol,
  //         recipientEmail
  //       );
  //     }
  //   }
  // }, [hash]);
  useEffect(() => {
    if (walletData?.transactionHash) {
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      if (selectedTokenData) {
        const emailContent = renderToString(
          <Email
            recipientEmail={recipientEmail}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenData.symbol}
          />
        );
        sendEmail({
          recipientEmail,
          subject: "Hooray! You got some crypto coin 🪙",
          htmlContent: emailContent,
          tokenAmount,
          tokenSymbol: selectedTokenData.symbol,
        });
        StoreTransactionData(
          recipientWalletAddress,
          activeAddress as `0x${string}`,
          tokenAmount,
          selectedTokenData.symbol,
          recipientEmail
        );
      }
    }
  }, [walletData?.transactionHash]);

  // Update the max amount
  useEffect(() => {
    if (selectedToken) {
      updateMaxAmount();
    }
  }, [selectedToken, tokens]);

  // Update token amount in form to max amount
  const updateMaxAmount = () => {
    const selectedTokenData = tokens.find(
      (t) => t.contractAddress === selectedToken
    );
    if (selectedTokenData) {
      setMaxAmount(selectedTokenData.balance);
    }
  };

  // Fetch token details for available token from database
  const fetchTokens = async () => {
    if (!activeAddress) {
      console.error("No address available");
      return;
    }

    setIsLoading(true);
    try {
      const optionChainId = walletData?.chainId || chainId;
      const response = await fetch(
        `/api/get-tokens?address=${activeAddress}&chainId=${optionChainId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("API Response:", data);
      if (data.tokens && Array.isArray(data.tokens)) {
        const allTokens = [
          {
            contractAddress: "native",
            symbol: data.nativeCurrency.symbol,
            name: data.nativeCurrency.name,
            balance: data.nativeCurrency.balance,
            rawBalance: data.nativeCurrency.rawBalance,
            decimals: data.nativeCurrency.decimals,
          },
          ...data.tokens,
        ];

        setTokens(allTokens);
        setSelectedToken("native");
        setSelectedTokenSymbol(data.nativeCurrency.symbol);
        setMaxAmount(data.nativeCurrency.balance);
      } else {
        console.warn("No tokens found or invalid data structure");
        setTokens([]);
      }
    } catch (error) {
      console.error("Error fetching tokens:", error);
      toast.error("Failed to fetch tokens");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedToken = e.target.value;
    setSelectedToken(newSelectedToken);
    const selectedTokenData = tokens.find(
      (t) => t.contractAddress === newSelectedToken
    );
    if (selectedTokenData) {
      setTokenAmount(selectedTokenData.balance);
      setSelectedTokenSymbol(selectedTokenData.symbol);
    }
  };

  const handleMaxClick = () => {
    setTokenAmount(maxAmount);
  };

  // Copy transaction hash for transaction
  const copyToClipboard = () => {
    if (walletData?.transactionHash) {
      navigator.clipboard.writeText(walletData.transactionHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Tx hash copied to clipboard");
    }
  };

  // Store txn data to show txn history
  const StoreTransactionData = async (
    walletAddress: string,
    address: string,
    tokenAmount: string,
    selectedTokenData: string,
    recipientEmail: string
  ) => {
    const storeResponse = await fetch("/api/store-transaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipientWallet: walletAddress,
        senderWallet: address,
        tokenAmount,
        tokenSymbol: selectedTokenData,
        recipientEmail,
        transactionHash: walletData?.transactionHash,
      }),
    });

    if (storeResponse.ok) {
      toast.success(
        "Transaction completed! Email sent to recipient successfully."
      );
    } else {
      console.error("Failed to store transaction");
      toast.error(
        "Transaction completed but failed to send email to recipient"
      );
    }
  };

  // Handler for sending transaction
  const handleSend = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      if (!selectedTokenData) {
        throw new Error("Selected token not found");
      }

      const amountInWei = parseUnits(tokenAmount, selectedTokenData.decimals);

      // let txHash;
      if (user?.email?.address) {
        // Use Privy's sendTransaction
        const tx = await privySendTransaction({
          to: walletAddress,
          value: amountInWei,
        });
        // txHash = tx.hash;
      } else if (walletData?.authenticated) {
        // Use wagmi's sendTransaction
        const tx = await wagmiSendTransaction({
          to: walletAddress as `0x${string}`,
          value: amountInWei,
        });
        // txHash = tx.hash;
      } else {
        throw new Error("No wallet connected");
      }

      setRecipientWalletAddress(walletAddress);
    } catch (error) {
      console.error("Error sending transaction:", error);
      toast.error("Failed to send transaction");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for adding token into database
  const handleAddToken = async (newToken: NewToken) => {
    try {
      const response = await fetch("/api/add-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newToken, chainId: walletData?.chainId }),
      });

      if (response.ok) {
        setShowAddTokenForm(false);
        // Optionally refresh token list or show success message
        fetchTokens(); // Assuming you have a function to refresh the token list
        toast.success("Token added successfully");
      } else {
        const data = await response.json();
        toast.error(data.message || "Failed to add token");
      }
    } catch (error) {
      console.error("Error adding token:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Close the help popup if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false); // Close the popup
      }
    }
    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHelp]);

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[4rem] ">
          <div
            className={`flex justify-between border-black border-b-0 px-[30px] py-[20px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`flex items-center space-x-3 p-2 rounded-[10px] shadow-lg ${
                theme === "dark" ? "bg-[#1C1C1C]  " : "bg-[#F4F3F3]  "
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${
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
              <span className="font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {activeAddress
                  ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
                  : "Connect or Login"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
                onClick={OpenHistory}
              >
                Transaction History
              </button>
            </div>
          </div>
          <div>
            <div
              className={`${
                theme === "dark"
                  ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                  : "bg-white/80 backdrop-blur-[80px]"
              } rounded-br-[40px] rounded-bl-[40px] `}
            >
              <div className="justify-evenly flex gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm bg-[#0A0A0A]/80 backdrop-blur-[80px] w-full basis-full shrink-0 border border-gray-500">
                <Tooltip
                  title="Base"
                  overlayStyle={{
                    backgroundColor: "#ff336a",
                    color: "white",
                    background: "none",
                    padding: "8px",
                  }}
                >
                  <button className="border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md">
                    <Image
                      src={base}
                      alt=""
                      className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                    />
                  </button>
                </Tooltip>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={bitcoin}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={cyfer}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={zora}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={derive}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={mode}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={lisk}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={kroma}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={op}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
                <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
                  <Image
                    src={fraxtal}
                    alt=""
                    className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
                  />
                </button>
              </div>
              <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[20px] py-[20px] justify-between items-center gap-[20px]">
                <div className="w-full md:w-[100%] ">
                  <div className="flex justify-between mx-5 ">
                    {" "}
                    <h3
                      className={`text-[20px] font-medium   ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                      }`}
                    >
                      All assets
                    </h3>
                    <button
                      onClick={() => setShowAddTokenForm(true)}
                      className={`addtoken hover:scale-110 duration-500 transition 0.3 ${
                        theme === "dark"
                          ? "bg-[#FFE500] text-[#363535]"
                          : "bg-[#E265FF] text-white"
                      }  px-4 py-2 rounded-full text-sm`}
                    >
                      Add Token
                    </button>
                  </div>

                  <div className="h-[30vh] overflow-y-auto scroll mt-[15px]">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-center text-gray-500 text-[18px]">
                          Loading tokens...
                        </span>
                      </div>
                    ) : tokens.length > 0 ? (
                      tokens.map((token, index) => (
                        <div
                          key={index}
                          className={`${
                            theme === "dark"
                              ? "bg-[#000000]/50 border border-white"
                              : " bg-[#FFFCFC]"
                          } flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 my-4 mx-4`}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={` font-bold ${
                                theme === "dark" ? "text-white" : "text-black"
                              }`}
                            >
                              {token.symbol}
                            </span>
                            <span> - {token.name} </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">
                              {parseFloat(token.balance).toFixed(4)}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span
                          className={` ${
                            theme === "dark"
                              ? "text-[#DEDEDE]"
                              : "text-[#696969]"
                          } text-center text-gray-500 text-[18px]`}
                        >
                          {isConnected
                            ? `No Tokens Found`
                            : `Connect wallet first`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-[95%] m-auto">
                  <div>
                    <label
                      className={`block text-lg font-[500]  mb-1 ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                      }`}
                    >
                      Enter token amount to send
                    </label>
                    <div className="flex space-x-2 justify-end">
                      <div
                        className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${
                          theme === "dark"
                            ? "bg-[#000000]/50 border border-white"
                            : " bg-[#FFFCFC] border border-gray-700"
                        }`}
                      >
                        <input
                          type="text"
                          placeholder=" token amount "
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className={`w-full bg-transparent outline-none ${
                            theme === "dark" ? "text-white" : "text-gray-800 "
                          } `}
                        />
                        <button
                          onClick={handleMaxClick}
                          className={`text-[12px] border  border-gray rounded-[5px] px-3 py-1 font-bold opacity-1 hover:opacity-[0.7] ${
                            theme === "dark"
                              ? "text-[#E265FF]"
                              : "text-[#FF336A]"
                          }`}
                        >
                          Max
                        </button>
                      </div>
                      <div className="relative">
                        <select
                          value={selectedToken}
                          onChange={handleChange}
                          className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center  outline-none ${
                            theme === "dark"
                              ? "bg-[#000000]/50 border border-white"
                              : " bg-[#FFFCFC] border border-gray-700"
                          }`}
                        >
                          <option
                            value=""
                            disabled
                            selected
                            className={` text-black hover:bg-gray-200 bg-opacity-50 ${
                              theme === "dark"
                                ? "bg-[#000000]/100 border border-white text-white"
                                : " bg-[#FFFCFC] border border-gray-700 text-black "
                            }`}
                          >
                            Select a token
                          </option>
                          {Array.isArray(tokens) &&
                            tokens.map((token) => (
                              <option
                                key={token.contractAddress}
                                value={token.contractAddress}
                                className={` text-black hover:bg-gray-200 bg-opacity-50 ${
                                  theme === "dark"
                                    ? "bg-[#000000]/100 border border-white text-white"
                                    : "bg-[#FFFCFC] border border-gray-700 text-black "
                                }`}
                              >
                                {token.symbol}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-lg font-[500]  mb-1 ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                      }`}
                    >
                      Enter recipient's email
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient's email address"
                      className={`w-full bg-opacity-50 rounded-xl p-3 mb-3 r  outline-none${
                        theme === "dark"
                          ? "bg-[#000000]/50 border border-white"
                          : " bg-[#FFFCFC] border border-gray-700"
                      }`}
                    />
                  </div>

                  <div className="flex  pt-3 space-x-7">
                    <button className="px-10 py-3 rounded-full border border-[#FF336A] text-[#FF336A] font-medium ">
                      CANCEL
                    </button>
                    <div className="send">
                      {" "}
                      <button
                        onClick={() => setIsPopupOpen(true)}
                        disabled={isLoading}
                        className=" hover:scale-110 duration-500 transition 0.3 px-10 py-3 rounded-full border border-red-300 text-white font-medium bg-[#FF336A]"
                      >
                        {isLoading ? "SEND" : "SEND"}
                      </button>
                    </div>
                  </div>
                  {hash && (
                    <div className="mt-5">
                      <label
                        className={`block text-lg font-[500]  mb-1 ${
                          theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                        }`}
                      >
                        Txn Hash:
                      </label>
                      <div
                        className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${
                          theme === "dark"
                            ? "bg-[#000000]/50 border border-white"
                            : " bg-[#FFFCFC]"
                        }`}
                      >
                        {hash ? `${hash.slice(0, 20)}...${hash.slice(-7)}` : ""}

                        <button
                          className={`p-1 text-[#FF336A] transition-colors ${
                            copied ? "text-[#FF336A]" : ""
                          }`}
                          onClick={copyToClipboard}
                        >
                          {copied ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <TxDetails
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenSymbol}
            recipientEmail={recipientEmail}
            onConfirm={handleSend}
          />
        </div>

        {showAddTokenForm && (
          <AddTokenForm
            onClose={() => setShowAddTokenForm(false)}
            onAddToken={handleAddToken}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SendToken;
