"use client";
import React, { useRef, useEffect, useState } from "react";
import { renderToString } from "react-dom/server";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAccount, useSendTransaction } from "wagmi";
import { parseUnits } from "viem";
import { toast, Toaster } from "react-hot-toast";
import { Copy, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { sendEmail } from "../../components/Email/Emailer";
import Email from "../../components/Email/Email";
import TxDetails from "../../components/TxDetails";
import AddTokenForm from "./AddTokenForm";
import Image from "next/image";
import lLogo from "../../assets/lLogo.png";
import dLogo from "../../assets/dLogo.png";
import { X } from "lucide-react"; // You can replace this with an actual icon library
import { NewToken, TokenWithBalance } from "../../types/types";
import Joyride from "react-joyride";

const SendToken = () => {
  const { address, isConnected } = useAccount();
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const { data: hash, sendTransaction } = useSendTransaction();
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
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref
  const [runTour3, setRunTour3] = useState(false); // Initially set to false

  const steps = [
    {
      target: ".send",
      disableBeacon: true,
      content: "Click here to send token to your friend after enter the details.",
    },
    {
      target: ".addtoken",
      disableBeacon: true,
      content: "Click here to add your custom token or token that you want to send.",
    },
    {
      target: ".showhelp",
      disableBeacon: true,
      content: "Need help? Click here for assistance.",
    },
  ];

  // Check if the tour has been completed previously
  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted3");
    if (!tourCompleted) {
      setRunTour3(true); // Run the tour if it hasn't been completed
    }
  }, []);

  // Handle the completion of the tour
  const handleTourCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("tourCompleted3", "true"); // Set tour as completed
      setRunTour3(false); // Stop running the tour
    }
  };

  const OpenHistory = () => {
    router.push("/transaction-history");
  };

  // Constantly fetching tokens from the database
  useEffect(() => {
    if (address) {
      fetchTokens();
    }
  }, [address]);

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
    if (hash) {
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
          address as `0x${string}`,
          tokenAmount,
          selectedTokenData.symbol,
          recipientEmail
        );
      }
    }
  }, [hash]);

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
    if (!address) {
      console.error("No address available");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-tokens?address=${address}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const tokenData = await response.json();

      if (Array.isArray(tokenData) && tokenData.length > 0) {
        setTokens(tokenData);
        setSelectedToken(tokenData[0].contractAddress);
        setSelectedTokenSymbol(tokenData[0].symbol);
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
    if (hash) {
      navigator.clipboard.writeText(hash);
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
        transactionHash: hash,
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

      const tx = await sendTransaction({
        to: walletAddress as `0x${string}`,
        value: amountInWei,
      });

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
        body: JSON.stringify(newToken),
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

  const toggleHelp = () => {
    setShowHelp(!showHelp);
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
              className={`flex items-center space-x-3 p-2 rounded-[10px] ${
                theme === "dark"
                  ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                  : "bg-[#F4F3F3] border border-[#C6C6C6]"
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
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connect Wallet"}
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
          <div
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] flex flex-col-reverse md:flex-col-reverse lg:flex-row space-y-6 md:space-y-0  lg:py-[40px] px-[30px]  md:py-[20px] py-[20px] justify-between items-center gap-[20px]`}
          >
            {" "}
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
                        theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                      } text-center text-gray-500 text-[18px]`}
                    >
                      {isConnected ? `No Tokens Found` : `Connect wallet first`}
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
                        theme === "dark" ? "text-[#E265FF]" : "text-[#FF336A]"
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
      <button
        className={`showhelp fixed bottom-4 right-4 bg-[#FF3333] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 ${
          !showHelp ? "animate-pulse" : ""
        }`}
        onClick={toggleHelp}
        onMouseEnter={() => setTooltipVisible(true)} // Show tooltip on hover
        onMouseLeave={() => setTooltipVisible(false)} // Hide tooltip when not hovering
      >
        {showHelp ? (
          <X className="w-6 h-6" /> // Close icon when popup is open
        ) : (
          "?" // Pulsing Question mark icon when popup is closed
        )}
      </button>

      {/* Tooltip */}
      {tooltipVisible && !showHelp && (
        <div
          className={`absolute bottom-16 right-1 text-sm rounded-lg px-3 py-1 z-50 shadow-lg mb-2 ${
            theme === "dark"
              ? "bg-[#FFFFFF] text-blue-700"
              : "bg-[#1C1C1C] text-[#FFE500]"
          }`}
        >
          Help Center
        </div>
      )}
      {/* Help Popup */}
      {showHelp && (
        <div
          ref={helpRef}
          className={`border border-[#FF3333] fixed  p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[60vh] z-50 overflow-y-auto scroll ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
          style={{
            position: "absolute",
            top: "30%", // Slightly adjusted top for better viewing on smaller screens
            right: "10px", // Aligns with the button's right side
          }}
        >
          <div>
            <div
              className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo"
              style={{ marginLeft: "-17px" }}
            >
              {theme === "light" ? (
                <Image
                  src={dLogo}
                  alt="CRYPTO-COURIER Dark Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto "
                />
              ) : (
                <Image
                  src={lLogo}
                  alt="CRYPTO-COURIER Light Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto "
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 ">Help Information</h2>
              <p className="">
                CryptoCourier makes it easy for you to send tokens to anyone
                using just their email address, even if they are new to crypto.
              </p>
              <p className="mt-2">
                <strong> About the Page: </strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>
                  You can add token you want to send by click on add token.
                </li>
                <li>
                  You have to add contract address of token and we will fetch
                  details for you.
                </li>
                <li>You can send token to anyone using their email id.</li>
                <li>
                  Enter token amount, select token and enter email address then
                  click on send.
                </li>
                <li>
                  We create a new wallet for Receiver and click on confirm
                  button will pop up one transaction in connected wallet.
                </li>
                <li>Click on confirm or approve to send token.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",

            borderImageSlice: 1,
            background: theme === "dark" ? "white" : "black",
            color: theme === "dark" ? "black" : "white",
          },
        }}
      />

      {/* Joyride for the tour */}
      <Joyride
        steps={steps}
        run={runTour3} // Only run if tour is not completed
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 1000,
            primaryColor: "#FF3333", // Customize button color to match your theme
          },
          buttonNext: {
            backgroundColor: "#FF3333",
            color: "#fff",
          },
        }}
        locale={{
          next: "Next", // Customize 'Next' button text
          last: "Finish",
        }}
        callback={handleTourCallback} // Handle tour completion
      />
    </div>
  );
};

export default SendToken;
