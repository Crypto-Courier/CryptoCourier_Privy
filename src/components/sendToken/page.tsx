"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import SwitchNetwork from "@/components/SwitchNetwork";
import "../../styles/History.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useSendTransaction } from "wagmi";
import { parseUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";
import notoken from "../../assets/Not-token.gif";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sendEmail } from "../Email/Emailer";
import Email from "../Email/Email";
import TxDetails from "../TxDetails";
import AddTokenForm from "./AddTokenForm";
import { NewToken, TokenWithBalance } from "../../types/types";
import { useWallet } from "../../context/WalletContext";
import { usePrivy } from "@privy-io/react-auth";
import Image from "next/image";
import { QrReader } from "react-qr-reader";
import QRScanner from "../QRScanner";
import { Contract } from "ethers";

interface QRScannerState {
  showQRScanner: boolean;
}

const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function"
  }
];

const SendToken = () => {
  const { walletData } = useWallet();
  const { data: hash, sendTransaction } = useSendTransaction();
  const { sendTransaction: privySendTransaction } = usePrivy();
  const [copied, setCopied] = useState(false);
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

  const isConnected = walletData?.authenticated;
  const activeAddress = walletData?.address;
  const isEmailConnected = walletData?.isEmailConnected;

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

  // When hash is available for txn, email should be sent to receiver
  useEffect(() => {
    if (hash || transactionHash) {
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

        setTokenAmount("");
        setRecipientEmail("");
      }
    }
  }, [hash || transactionHash]);

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
      const response = await fetch(
        `/api/get-tokens?address=${activeAddress}&chainId=${
          walletData?.chainId.split(":")[1]
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
      setTokenAmount("");
    }
  };

  const handleMaxClick = () => {
    setTokenAmount(maxAmount);
  };

  // Copy transaction hash for transaction
  // const copyToClipboard = () => {
  //   if (walletData?.transactionHash) {
  //     navigator.clipboard.writeText(walletData.transactionHash);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //     toast.success("Tx hash copied to clipboard");
  //   }
  // };

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
          transactionHash: hash || transactionHash,
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

  // Handler for sending transaction
  // const handleSend = async (walletAddress: string) => {
  //   try {
  //     setIsLoading(true);
  //     const selectedTokenData = tokens.find(
  //       (t) => t.contractAddress === selectedToken
  //     );
  //     if (!selectedTokenData) {
  //       throw new Error("Selected token not found");
  //     }

  //     const amountInWei = parseUnits(tokenAmount, selectedTokenData.decimals);

  //     if (isEmailConnected) {
  //       // Use Privy's sendTransaction for email-connected users
  //       const tx = await privySendTransaction({
  //         to: walletAddress,
  //         value: amountInWei,
  //       });
  //       setTransactionHash(tx.transactionHash);
  //       console.log("Transaction hash:", transactionHash);
  //     } else if (walletData?.authenticated) {
  //       await sendTransaction({
  //         to: walletAddress as `0x${string}`,
  //         value: amountInWei,
  //       });
  //     } else {
  //       throw new Error("No wallet connected");
  //     }

  //     setRecipientWalletAddress(walletAddress);
  //   } catch (error) {
  //     console.error("Error sending transaction:", error);
  //     toast.error("Failed to send transaction");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleSend = async (walletAddress: string) => {
  //   try {
  //     setIsLoading(true);
  //     const selectedTokenData = tokens.find(
  //       (t) => t.contractAddress === selectedToken
  //     );
  //     if (!selectedTokenData) {
  //       throw new Error("Selected token not found");
  //     }
  
  //     // Calculate the token amount in Wei
  //     const tokenAmountInWei = parseUnits(tokenAmount, selectedTokenData.decimals);
      
  //     // Calculate 0.002 ETH in Wei (fixed amount)
  //     const additionalEthInWei = parseUnits("0.0002", 18);
  
  //     if (isEmailConnected) {
  //       // For Privy users, we need to send two separate transactions
  //       // First send the token amount

  //       const totalValue = tokenAmountInWei + additionalEthInWei;

  //       const tokenTx = await privySendTransaction({
  //         to: walletAddress,
  //         value: totalValue,
  //       });
  
  //       // Then send the additional ETH
  //       // const ethTx = await privySendTransaction({
  //       //   to: walletAddress,
  //       //   value: additionalEthInWei,
  //       // });
  
  //       // Store the last transaction hash
  //       setTransactionHash(tokenTx.transactionHash);
  //       console.log("Transaction hashes:", tokenTx.transactionHash/*, ethTx.transactionHash*/);
        
  //     } else if (walletData?.authenticated) {
  //       // For regular wallet users, we can combine both values
  //       const totalValue = tokenAmountInWei + additionalEthInWei;
        
  //       await sendTransaction({
  //         to: walletAddress as `0x${string}`,
  //         value: totalValue,
  //         // You might want to add gas estimation here
  //         // gas: await estimateGas({ ... }),
  //       });
  //     } else {
  //       throw new Error("No wallet connected");
  //     }
  
  //     setRecipientWalletAddress(walletAddress);
      
  //     // Show success message for bundled transaction
  //     toast.success("Sending token amount plus 0.002 ETH");
      
  //   } catch (error) {
  //     console.error("Error sending bundled transaction:", error);
  //     toast.error("Failed to send bundled transaction");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleSend = async (walletAddress: string) => {
    try {
      setIsLoading(true);
      const selectedTokenData = tokens.find(
        (t) => t.contractAddress === selectedToken
      );
      
      if (!selectedTokenData) {
        throw new Error("Selected token not found");
      }
  
      // Calculate the token amount in Wei
      const tokenAmountInWei = parseUnits(tokenAmount, selectedTokenData.decimals);
      
      // Additional ETH amount in Wei
      const additionalEthInWei = parseUnits("0.0002", 18);
  
      if (selectedToken === "native") {
        // Handle native token (ETH) transfer
        const totalValue = tokenAmountInWei + additionalEthInWei;
  
        if (isEmailConnected) {
          const tx = await privySendTransaction({
            to: walletAddress,
            value: totalValue,
          });
          setTransactionHash(tx.transactionHash);
        } else if (walletData?.authenticated) {
          await sendTransaction({
            to: walletAddress as `0x${string}`,
            value: totalValue,
          });
        }
      } else {
        // Handle ERC20 token transfer
        const tokenContract = new Contract(
          selectedTokenData.contractAddress,
          ERC20_ABI,
          walletData?.provider
        );
  
        if (isEmailConnected) {
          // For ERC20 tokens, we need two transactions:
          // 1. Transfer the token
          const tokenTx = await privySendTransaction({
            to: selectedTokenData.contractAddress,
            data: tokenContract.interface.encodeFunctionData("transfer", [
              walletAddress,
              tokenAmountInWei
            ]),
          });
  
          // 2. Send the additional ETH
          const ethTx = await privySendTransaction({
            to: walletAddress,
            value: additionalEthInWei,
          });
  
          setTransactionHash(tokenTx.transactionHash);
        } else if (walletData?.authenticated) {
          // First approve the token transfer
          const tokenTx = await sendTransaction({
            to: selectedTokenData.contractAddress as `0x${string}`,
            data: tokenContract.interface.encodeFunctionData("transfer", [
              walletAddress,
              tokenAmountInWei
            ]) as `0x${string}`,
          });
  
          // Then send the additional ETH
          await sendTransaction({
            to: walletAddress as `0x${string}`,
            value: additionalEthInWei,
          });
        }
      }
  
      setRecipientWalletAddress(walletAddress);
      toast.success(`Sending ${tokenAmount} ${selectedTokenData.symbol} plus 0.0002 ETH`);
      
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
        body: JSON.stringify({
          ...newToken,
          chainId: walletData?.chainId.split(":")[1],
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

  const handleQRAddressFound = (address: string) => {
    console.log('QR code scanned address:', address);
    setRecipientEmail(address);
    toast.success('Address set from QR code');
  };

  return (
    <div className="main">
      <Navbar />
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[4rem] ">
          <div
            className={`flex justify-end sm:justify-end md:justify-between  lg:justify-between border-black border-b-0 px-[30px] py-[20px]  ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
          >
            <div
              className={`hidden lg:flex md:flex sm:hidden  flex items-center space-x-3 p-2 rounded-[10px] shadow-lg ${
                theme === "dark" ? "bg-[#1C1C1C]  " : "bg-[#F4F3F3]  "
              }`}
            >
              <div
                className={`hidden lg:flex md:flex sm:hidden w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${
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
              <span className="hidden lg:flex md:flex sm:hidden font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
                {activeAddress
                  ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
                  : "Connect or Login"}
              </span>
            </div>
            <div className="text-right  items-end">
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[13px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
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
              <SwitchNetwork />
              <div className="flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[30px] py-[30px] justify-between items-center lg:gap-[20px] md:gap-[20px] sm:gap-[20px] gap-[30px]">
                <div className="w-full md:w-[100%] ">
                  <div className="flex justify-between lg:mx-5 md:mx-5 sm:mx-5  ">
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
                          } flex justify-between items-center bg-opacity-50 rounded-xl shadow-sm py-2 px-5 my-4 mx-0 lg:mx-4 md:mx-4 sm:mx-4 `}
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
                      className={`block text-lg font-[500]  mb-1 ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                      }`}
                    >
                      Enter token amount to send
                    </label>
                    <div className="flex lg:space-x-2 md:space-x-2 sm:space-x-2 justify-end flex-col lg:flex-row md:flex-row sm:flex-row">
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

                      <select
                        value={selectedToken}
                        onChange={handleChange}
                        className={`flex-grow bg-opacity-50 rounded-xl p-3 mb-3 flex justify-between items-center  outline-none w-full md:w-[15%] sm:w-[15%] lg:w-[15%] ${
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

                  <div>
                    <label
                      className={`block text-lg font-[500] mb-1 ${
                        theme === "dark" ? "text-[#DEDEDE]" : "text-black"
                      }`}
                    >
                      Enter recipient's email or address
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="recipient's email or address"
                      className={`w-full bg-opacity-50 rounded-xl p-3 mb-3 r  outline-none${
                        theme === "dark"
                          ? "bg-[#000000]/50 border border-white"
                          : " bg-[#FFFCFC] border border-gray-700"
                      }`}
                    />
                    <button
                      onClick={() => setShowQRScanner(true)}
                      className={`px-4 mb-3 rounded-xl ${
                        theme === "dark"
                          ? "bg-[#000000]/50 border border-white text-white"
                          : "bg-[#FFFCFC] border border-gray-700 text-black"
                      }`}
                      type="button"
                      aria-label="Scan QR Code"
                    >
                      Scan
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
                  {/* {hash && (
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
                  )} */}
                </div>
              </div>
            </div>
            {showQRScanner && (
              <QRScanner
                onScan={handleQRScan}
                onClose={() => setShowQRScanner(false)}
              />
            )}
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
