"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import SwitchNetwork from "@/components/SwitchNetwork";
import { ChevronDown } from "lucide-react";
import "../../styles/History.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  useWriteContract,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { sendTransaction, waitForTransactionReceipt } from '@wagmi/core'
import { parseUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";
import notoken from "../../assets/Not-token.gif";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sendEmail } from "../Email/Emailer";
import Email from "../Email/Email";
import TransferDetails from "../TransferDetails";
import AddTokenForm from "./AddTokenForm";
import { AddToken } from "../../types/add-token-form-types";
import { TokenWithBalance } from "../../types/types";
import { useWallet } from "../../context/WalletContext";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import QRScanner from "../QRScanner";
import QR from "../../assets/QR.svg";
import { Contract } from "ethers";
import ERC20_ABI from "../../abis/ERC-20.json";
import TRANSACTIONS_CONTRACT_ABI from "../../abis/TRANSACTIONS_ABI.json";
import { wagmiConfig } from "../Providers";
import TransactionPopup from "../TransactionPopup";
import { sign } from "crypto";
import MenuDivider from "antd/es/menu/MenuDivider";

const SendToken = () => {
  const { walletData } = useWallet();
  const { sendTransaction: privySendTransaction } = usePrivy();

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { writeContractAsync: approveAsync } = useWriteContract();

  const [previousChainId, setPreviousChainId] = useState<string>("");
  const router = useRouter();
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
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState("pending");
  const [showTxPopup, setShowTxPopup] = useState(false);
  const [senderWallet, setsenderWallet] = useState("");
  const { user } = usePrivy();

  const isConnected = walletData?.authenticated;
  const activeAddress = walletData?.address;
  const isEmailConnected = walletData?.isEmailConnected;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const TRANSACTIONS_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_TRANSACTIONS_CONTRACT_ADDRESS;

  if (!TRANSACTIONS_CONTRACT_ADDRESS) {
    throw new Error("Contract address is not defined");
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Add this handler function
  const handleQRScan = (address: string): void => {
    setRecipientEmail(address);
    setShowQRScanner(false);
  };

  const OpenHistory = () => {
    router.push("/history?mode=default");
  };

  // Add a function to validate if input is an email
  const isValidEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  // Add a function to validate if input is a wallet address
  const isValidWalletAddress = (input: string): boolean => {
    // Basic Ethereum address validation (0x followed by 40 hex characters)
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    return addressRegex.test(input);
  };

  // Modify the button click handler
  const handleButtonClick = async () => {
    if (!tokenAmount || !recipientEmail || !selectedToken) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (isValidEmail(recipientEmail)) {
      // If it's an email, show the popup
      setIsPopupOpen(true);
    } else if (isValidWalletAddress(recipientEmail)) {
      // If it's a wallet address, directly call handleSend
      await handleSend(recipientEmail);
    } else {
      toast.error("Please enter a valid email or wallet address");
    }
  };

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

  const getSenderIdentifier = (user: any) => {
    // If Privy wallet client and email exists, return email
    if (user.wallet?.walletClientType === "privy" && user.email?.address) {
      return user.email.address;
    }
    if (user.wallet?.address) {
      return `${user.wallet.address.slice(0, 6)}...${user.wallet.address.slice(
        -4
      )}`;
    }
  };
  // When hash is available for txn, email should be sent to receiver
  useEffect(() => {
    if (transactionHash) {
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      if (selectedTokenData) {
        const senderIdentifier = getSenderIdentifier(user);
        const emailContent = renderToString(
          <Email
            recipientEmail={recipientEmail}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenData.symbol}
            senderIdentifier={senderIdentifier} // Pass sender identifier to email component
          />
        );
        sendEmail({
          recipientEmail,
          subject: "Hooray! You got some crypto coin 🪙",
          htmlContent: emailContent,
          tokenAmount,
          tokenSymbol: selectedTokenData.symbol,
          senderIdentifier,
        });
        StoreTransactionData(
          recipientWalletAddress,
          activeAddress as `0x${string}`,
          tokenAmount,
          selectedTokenData.symbol,
          recipientEmail
        );

        setTokenAmount("");
        setRecipientEmail("");
      }
    }
  }, [transactionHash]);

  useEffect(() => {
    if (selectedToken) {
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      if (selectedTokenData) {
        setMaxAmount(selectedTokenData.balance);
      }
    }
  }, [selectedToken, tokens]);

  // Fetch token details for available token from database
  const fetchTokens = async () => {
    if (!activeAddress) {
      console.error("No address available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/get-tokens?address=${activeAddress}&chainId=${walletData?.chainId.split(":")[1]
        }`
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setTokenAmount(maxAmount);
  };

  // Store txn data to show txn history
  const StoreTransactionData = async (
    walletAddress: string,
    address: string,
    tokenAmount: string,
    selectedTokenData: string,
    recipientEmail: string
  ) => {
    try {
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
          transactionHash: transactionHash,
          chainId: walletData?.chainId.split(":")[1],
        }),
      });

      if (storeResponse.ok) {
        console.log("Transaction stored successfully");
        toast.success(
          "Transaction completed! Email sent to recipient successfully."
        );
      } else {
        console.error("Failed to store transaction");
        toast.error(
          "Transaction completed but failed to send email to recipient"
        );
      }
    } catch (error) {
      console.error("Error storing transaction:", error);
      toast.error("Failed to store transaction data");
    }
  };

  // Handling the transaction for embedded as well as external wallets
  const handleSend = async (walletAddress: string) => {
    try {
      setTxStatus("pending");
      setShowTxPopup(true);
      setIsLoading(true);

      // Find Token contract address from the token data to interact
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );

      if (!selectedTokenData) {
        throw new Error("Selected token not found");
      }

      // Calculate the token amount in Wei
      const tokenAmountInWei = parseUnits(
        tokenAmount,
        selectedTokenData.decimals
      );

      // Additional ETH amount in Wei
      const additionalEthInWei = parseUnits("0.0002", 18);

      // Tokens are sent only to recipients who have been invited via email.
      const totalValue = tokenAmountInWei + additionalEthInWei;

      // Handle native token (ETH) transfer
      if (selectedToken === "native") {

        if (isEmailConnected) {
          // Embedded wallet is connected and native token is selected

          if (!isValidEmail(recipientEmail)) {
            // Sending through EOA or Scanning
            const tx = await privySendTransaction({
              to: walletAddress,
              value: tokenAmountInWei,
            });
            setTransactionHash(tx.transactionHash);
            setTxStatus("success");
          } else {
            // Sedning through Email or Inviting
            const tx = await privySendTransaction({
              to: walletAddress,
              value: totalValue,
            });
            setTransactionHash(tx.transactionHash);
            setTxStatus("success");
          }
        } else if (walletData?.authenticated && walletClient) {
          // External wallet is connected and native token is selected

          if (!isValidEmail(recipientEmail)) {
            // Sending through EOA or Scanning
            const tx = await sendTransaction(wagmiConfig, {
              to: walletAddress as `0x${string}`,
              value: tokenAmountInWei,
            });
            const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: tx });
            if (receipt.status === "success") {
              setTransactionHash(tx);
              setTxStatus("success");
              toast.success(
                `Successfully sent ${tokenAmount} ETH`
              );
            }
          } else {
            // Sedning through Email or Inviting
            const tx = await sendTransaction(wagmiConfig, {
              to: walletAddress as `0x${string}`,
              value: totalValue,
            });
            const receipt = await waitForTransactionReceipt(wagmiConfig, { hash: tx });
            if (receipt.status === "success") {
              setTransactionHash(tx);
              setTxStatus("success");
              toast.success(
                `Successfully sent ${tokenAmount} ETH`
              );
            }
          }
        }
      } else {
        // Handle ERC20 token / NON-NATIVE token transfer

        // Initialize a contract instance for interacting with Transaction contract.
        const transactionsContract = new Contract(
          TRANSACTIONS_CONTRACT_ADDRESS,
          TRANSACTIONS_CONTRACT_ABI,
          walletData?.provider
        );

        // Initialize a contract instance for interacting with the selected ERC-20 token contract.
        const tokenContract = new Contract(
          selectedTokenData.contractAddress,
          ERC20_ABI,
          walletData?.provider
        );

        if (isEmailConnected) {

          // Embedded wallet is connected and non-native token is selected

          if (isValidEmail(recipientEmail)) {

            // Sedning through Email or Inviting

            // Sends a transaction to approve the Transactions contract to spend a specified non-native token amount on behalf of the sender.
            const approveTx = await privySendTransaction({
              to: selectedTokenData.contractAddress,
              data: tokenContract.interface.encodeFunctionData("approve", [
                TRANSACTIONS_CONTRACT_ADDRESS,
                tokenAmountInWei,
              ]),
            });

            if (approveTx.transactionHash) {

              // Sends a transaction to the Transactions contract to transfer both ETH and non-native token to the recipient.
              const tx = await privySendTransaction({
                to: TRANSACTIONS_CONTRACT_ADDRESS,
                value: additionalEthInWei,
                data: transactionsContract.interface.encodeFunctionData(
                  "transferWithEth",
                  [
                    selectedTokenData.contractAddress,
                    walletAddress,
                    tokenAmountInWei,
                  ]
                ),
              });

              if (tx.transactionHash) {
                setTransactionHash(tx.transactionHash);
                setTxStatus("success");
              }
            }
          } else {

            // Sending through EOA or Scanning

            // Transaction for transfer both ETH and non-native token to the recipient.
            const tx = await privySendTransaction({
              to: selectedTokenData.contractAddress,
              data: tokenContract.interface.encodeFunctionData(
                "transfer",
                [
                  walletAddress,
                  tokenAmountInWei,
                ]
              ),
            });

            if (tx.transactionHash) {
              setTransactionHash(tx.transactionHash);
              setTxStatus("success");
            }
          }
        } else if (walletData?.authenticated && walletClient) {

          // External wallet is connected and non-native token is selected

          if (isValidEmail(recipientEmail)) {

            // Sedning through Email or Inviting

            if (approveAsync) {

              // Approve the Transactions contract to spend the selected token amount
              const approveTxHash = await approveAsync({
                address: selectedTokenData.contractAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "approve",
                args: [TRANSACTIONS_CONTRACT_ADDRESS, tokenAmountInWei],
              });

              // Wait for the approval transaction 
              const approveReceipt =
                await publicClient?.waitForTransactionReceipt({
                  hash: approveTxHash,
                  confirmations: 1,
                });

              if (approveReceipt?.status === "success") {

                // Call the transferWithEth function on the Transactions contract to send ETH and tokens
                const transferTxHash = await approveAsync({
                  address: TRANSACTIONS_CONTRACT_ADDRESS as `0x${string}`,
                  abi: TRANSACTIONS_CONTRACT_ABI,
                  functionName: "transferWithEth",
                  args: [
                    selectedTokenData.contractAddress,
                    walletAddress,
                    tokenAmountInWei,
                  ],
                  value: additionalEthInWei,
                });

                // Wait for the transfer transaction
                const transferReceipt =
                  await publicClient?.waitForTransactionReceipt({
                    hash: transferTxHash,
                    confirmations: 1,
                  });

                if (transferReceipt?.status === "success") {
                  toast.success(
                    `Successfully sent ${tokenAmount} ${selectedTokenSymbol}`
                  );
                  setTransactionHash(transferTxHash);
                  setTxStatus("success");
                }
              }
            }
          } else {

            // Sedning through EOA or Scan

            if (approveAsync) {
              // Send the selected tokens directly to the recipient using the transfer function
              const tx = await approveAsync({
                address: selectedTokenData.contractAddress as `0x${string}`,
                abi: ERC20_ABI,
                functionName: "transfer",
                args: [walletAddress, tokenAmountInWei],
              });

              // Wait for the transfer transaction to be mined
              const transferReceipt = await publicClient?.waitForTransactionReceipt({
                hash: tx,
                confirmations: 1,
              });

              if (transferReceipt?.status === "success") {
                toast.success(
                  `Successfully sent ${tokenAmount} ${selectedTokenSymbol}`
                );
                setTransactionHash(tx);
                setTxStatus("success");
              }
            }

          }
        }
      }

      setRecipientWalletAddress(walletAddress);
    } catch (error) {
      toast.dismiss();
      console.error("Error sending transaction:", error);

      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          toast.error("Transaction was rejected by user");
        } else if (error.message.includes("insufficient funds")) {
          toast.error("Insufficient funds for transaction");
        } else {
          toast.error("Failed to send transaction");
        }
      } else {
        toast.error("Failed to send transaction");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for adding token into database
  const handleAddToken = async (newToken: AddToken) => {
    try {
      const chainId = walletData?.chainId.split(":")[1];
      const response = await fetch("/api/add-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newToken,
          chainId: chainId ? parseInt(chainId, 10) : undefined,
        }),
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

  useEffect(() => {
    fetchTokens();
  }, [walletData?.chainId, activeAddress]); // Re-fetch tokens when chainId or activeAddress changes

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
            className={`flex justify-end sm:justify-end md:justify-between  lg:justify-between border-black border-b-0 px-[30px] py-[20px]  ${theme === "dark" ? "bg-black" : "bg-white"
              } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`hidden lg:flex md:flex sm:hidden   items-center space-x-3 p-2 rounded-[10px] shadow-lg ${theme === "dark" ? "bg-[#1C1C1C]  " : "bg-[#F4F3F3]  "
                }`}
            >
              <div
                className={`hidden lg:flex md:flex sm:hidden w-10 h-10 rounded-full  items-center justify-center border-2 transition duration-300 hover:scale-110 ${theme === "dark"
                  ? "border-white bg-transparent"
                  : "border-gray-500 bg-transparent"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                    }`}
                ></div>
              </div>
              <span className="hidden lg:flex md:flex sm:hidden font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {activeAddress
                  ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
                  : "Connect or Login"}
              </span>
            </div>
            <div className="text-right  items-end">
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[13px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${theme === "dark"
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
              className={`${theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
                } rounded-br-[40px] rounded-bl-[40px] `}
            >
              <SwitchNetwork />
              <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[30px] py-[30px] justify-between items-center lg:gap-[20px] md:gap-[20px] sm:gap-[20px] gap-[30px]">
                <div className="w-full md:w-[100%] ">
                  <div className="flex justify-between lg:mx-5 md:mx-5 sm:mx-5  ">
                    {" "}
                    <h3
                      className={`text-[20px] font-medium   ${theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                        }`}
                    >
                      All assets
                    </h3>
                    <button
                      onClick={() => setShowAddTokenForm(true)}
                      className={`addtoken hover:scale-110 duration-500 transition 0.3 ${theme === "dark"
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
                          className={`${theme === "dark"
                            ? "bg-[#000000]/50 border border-white"
                            : " bg-[#FFFCFC]"
                            } flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 my-4 mx-0 lg:mx-4 md:mx-4 sm:mx-4 `}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={` font-bold ${theme === "dark" ? "text-white" : "text-black"
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
                          className={` ${theme === "dark"
                            ? "text-[#DEDEDE]"
                            : "text-[#696969]"
                            } text-center text-gray-500 text-[18px]`}
                        >
                          {isConnected
                            ? `No token found`
                            : `Connect wallet first`}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full md:w-[95%] m-auto">
                  <div>
                    <label
                      className={`block text-lg font-[500]  mb-1 ${theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                        }`}
                    >
                      Enter token amount to send
                    </label>
                    <div className="flex lg:space-x-2 md:space-x-2 sm:space-x-2 justify-end flex-col lg:flex-row md:flex-row sm:flex-row">
                      <div
                        className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center ${theme === "dark"
                          ? "bg-[#000000]/50 border border-white"
                          : " bg-[#FFFCFC] border border-gray-700"
                          }`}
                      >
                        <input
                          type="text"
                          placeholder=" token amount "
                          value={tokenAmount}
                          onChange={(e) => setTokenAmount(e.target.value)}
                          className={`w-full bg-transparent outline-none ${theme === "dark" ? "text-white" : "text-gray-800 "
                            } `}
                        />
                        <button
                          onClick={handleMaxClick}
                          className={`text-[12px] border  border-gray rounded-[5px] px-3 py-1 font-bold opacity-1 hover:opacity-[0.7] ${theme === "dark"
                            ? "text-[#E265FF]"
                            : "text-[#FF336A]"
                            }`}
                        >
                          Max
                        </button>
                      </div>
                      <div className="relative w-[30%]">
                        <div
                          className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center  outline-none   ${theme === "dark"
                            ? "bg-[#000000]/50 border border-white"
                            : " bg-[#FFFCFC] border border-gray-700"
                            }`}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <span className="font-semibold text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                            {selectedTokenSymbol || "Select a token"}
                          </span>
                          <ChevronDown size={20} color="#FFE500" />
                        </div>

                        {isDropdownOpen && (
                          <div
                            ref={dropdownRef}
                            className={`absolute top-12 left-0 w-[150px] rounded-md shadow-lg z-10 max-h-[300px] overflow-x-hidden scroll ${theme === "dark"
                              ? "bg-[#1C1C1C] text-white border border-white"
                              : "bg-white text-black border border-gray-700"
                              }`}
                          >
                            {tokens && tokens.length === 0 ? (
                              <div className="p-2 text-center text-gray-500">
                                Loading...
                              </div>
                            ) : (
                              Array.isArray(tokens) &&
                              tokens.map((token) => (
                                <div
                                  key={token.contractAddress}
                                  onClick={() => {
                                    setSelectedToken(token.contractAddress);
                                    setSelectedTokenSymbol(token.symbol);
                                    setIsDropdownOpen(false);
                                    // Reset token amount when changing token
                                    setTokenAmount("");
                                  }}
                                  className={`cursor-pointer p-2 ${theme === "dark"
                                    ? "bg-[#000000]/100  hover:bg-gray-100 hover:text-black mb-1 "
                                    : "bg-[#FFFCFC]  hover:bg-black hover:text-white mb-1"
                                    } ${selectedToken === token.contractAddress
                                      ? theme === "dark"
                                        ? "bg-white text-black"
                                        : "bg-black text-white"
                                      : ""
                                    }`}
                                >
                                  {token.symbol}
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-lg font-[500] mb-1 ${theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                        }`}
                    >
                      Enter recipient's email or address
                    </label>
                    <div className="flex gap-2">
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient's email or address"
                      className={`w-full bg-opacity-50 rounded-xl p-3 mb-3 r  outline-none${theme === "dark"
                        ? "bg-[#000000]/50 border border-white"
                        : " bg-[#FFFCFC] border border-gray-700"
                        }`}
                    />
                    {/* <button
                      onClick={() => setShowQRScanner(true)}
                      className={`px-2 mb-3 py-2 rounded-md lg:hidden md:hidden sm:hidden flex ${theme === "dark"
                        ? "bg-[#000000]/50 border border-white text-white"
                        : "bg-[#FFFCFC] border border-gray-700 text-black"
                        }`}
                      type="button"
                      aria-label="Scan QR Code"
                    >
                      <Image src={QR} alt="" width={20} />
                    </button>
                  </div>

                  <div className="flex  pt-3 space-x-7 ">
                    <button className="px-7 py-3 lg:px-10 md:px-10 sm:px-10 rounded-full border border-[#FF336A] text-[#FF336A]  lg:text-md md:text-md text-sm sm:text-md">
                      CANCEL
                    </button>

                    <button
                      onClick={handleButtonClick}
                      disabled={isLoading}
                      className="hover:scale-110 duration-500 transition 0.3 px-7 py-3 lg:px-10 md:px-10 sm:px-10 rounded-full border border-red-300 text-white lg:text-md md:text-md text-sm sm:text-md bg-[#FF336A]"
                    >
                      {isLoading ? "SENDING..." : "SEND"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* {showQRScanner && (
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowQRScanner(false)}
              />
            )} */}
          </div>
          <TransferDetails
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenSymbol}
            recipientEmail={recipientEmail}
            onConfirm={handleSend}
          />
          {/* <TransactionPopup
            isOpen={showTxPopup}
            onClose={() => setShowTxPopup(false)}
            tokenAmount={tokenAmount}
            tokenSymbol={selectedTokenSymbol}
            status={txStatus}
            txHash={hash || transactionHash}
            senderWallet={""}
            recipientWallet={""}
            customizedLink={""}
            recipientEmail={""}
          /> */}
        </div>

        {showAddTokenForm && (
          <AddTokenForm
            onClose={() => setShowAddTokenForm(false)}
            onAddToken={handleAddToken}
          />
        )}
      </div>
      <Footer />
      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",

            borderImageSlice: 1,
            background: theme === "dark" ? "white" : "white",
            color: theme === "dark" ? "black" : "black",
          },
        }}
      />
    </div>
  );
};

export default SendToken;
