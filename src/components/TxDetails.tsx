import React, { useState } from "react";
import { X, Copy, CheckCircle } from "lucide-react";
import wallet from "../assets/wallet.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import trx2 from "../assets/trx2.png";
import {TxDetailsProps} from "../types/types"

const TxDetails: React.FC<TxDetailsProps> = ({
  isOpen,
  onClose,
  tokenAmount,
  tokenSymbol,
  recipientEmail,
  onConfirm,
}) => {
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCreateWallet = async () => {
    try {
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: recipientEmail }),
      });

      const data = await response.json();
      const walletAccount = data.linked_accounts.find(
        (account: any) => account.type === "wallet"
      );

      if (walletAccount) {
        setWalletAddress(walletAccount.address);
        setIsWalletCreated(true);
      } else {
        console.log("No wallet address found in the response");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  const handleConfirm = () => {
    onConfirm(walletAddress);
    onClose();
  };

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        className={`rounded-[10px] max-w-lg w-full mx-4 relative ${
          theme === "dark"
            ? "bg-[#111111] border-[#FE660A] border backdrop-blur-[10px]"
            : "bg-[#FFFCFC] border border-[#FE005B]/60"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-[1rem]  p-1 hover:opacity-[0.6]"
        >
          <X size={20} className="text-[#FF005C]"/>
        </button>

        <div
          className={`flex justify-center items-center p-6 rounded-tr-[10px] rounded-tl-[10px] ${
            theme === "dark"
              ? "bg-[#000000] border-b-2 border-[#FE660A]"
              : "bg-white border-b-2 border-[#FE005B]"
          }`}
        >
          <div className="flex items-center flex-col">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mb-2">
              {theme === "light" ? (
                <Image src={wallet} alt="wallet" />
              ) : (
                <Image src={trx2} alt="wallet" />
              )}
            </div>
            <h2
              className={`text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {isWalletCreated ? "Transaction Details" : "Create Wallet"}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {!isWalletCreated ? (
            <div>
              <p
                className={`text-center mb-4 ${
                  theme === "dark" ? "text-white" : "text-black"
                }`}
              >
                A new wallet will be created for {recipientEmail}
              </p>
              <button
                onClick={handleCreateWallet}
                className={`${
                  theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                } w-full text-white py-2 rounded-[10px] flex items-center justify-center mb-4`}
              >
                Create Wallet
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4 flex-col w-[80%] m-auto">
                <div className="item-start font-semibold">Send</div>

                <p
                  className={` text-md rounded-[12px] text-md py-2 px-4 font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500]   bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {tokenAmount} {tokenSymbol} to {recipientEmail}
                </p>
                <div className="item-start font-semibold">
                  {" "}
                  New Wallet for Recipient
                </div>
                <p
                  className={` text-md rounded-[12px] text-md py-2 px-4 flex justify-between font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500]  bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {walletAddress
                    ? `${walletAddress.slice(0, 20)}...${walletAddress.slice(
                        -7
                      )}`
                    : ""}
                  <button
                    className={`p-1 text-[#FFE500] transition-colors ${
                      theme === "dark" ? "text-[#FFE500]" : "text-[#0052FF]"
                    }`}
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </p>
                <p>You can check out transaction for transparency.</p>
              </div>

              <div className="flex gap-5 w-[80%] m-auto">
                <button
                  onClick={onClose}
                  className={`${
                    theme === "dark"
                      ? "border border-[#FE660A]"
                      : "border border-[#0052FF] text-[#0052FF]"
                  } w-full text-white py-3 rounded-[50px] flex items-center justify-center font-semibold `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`${
                    theme === "dark" ? "bg-[#FE660A]" : "bg-[#0052FF]"
                  } w-full text-white py-3 rounded-[50px] flex items-center justify-center font-semibold hover:scale-110 duration-500 transition 0.1`}
                >
                  Confirm
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TxDetails;
