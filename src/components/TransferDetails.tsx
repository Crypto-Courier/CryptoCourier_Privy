import React, { useEffect, useState } from "react";
import { X, Copy, CheckCircle } from "lucide-react";
import wallet from "../assets/wallet.png";
import Image from "next/image";
import { useTheme } from "next-themes";
import trx2 from "../assets/trx2.png";
import { TransferDetailsProps } from "../types/transfer-detail-types";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";

const TransferDetails: React.FC<TransferDetailsProps> = ({
  isOpen,
  onClose,
  tokenAmount,
  tokenSymbol,
  recipientEmail,
  onConfirm,
  transferType,
  isContractCall,
}) => {
  const [isWalletCreated, setIsWalletCreated] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const { getAccessToken } = usePrivy();

  // Check email embedded wallet from privy
  useEffect(() => {
    if (!isOpen || !recipientEmail || transferType !== "email") return;

    const checkWallet = async () => {
      setChecking(true);

      try {
        const token = await getAccessToken();

        const response = await axios.post(
          "/api/check-privy-wallet",
          { email: recipientEmail },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data) {
          setWalletAddress(response.data);
          setIsWalletCreated(true);
        } else {
          setIsWalletCreated(false);
        }
      } catch (error) {
        setIsWalletCreated(false);
      } finally {
        setChecking(false);
      }
    };

    checkWallet();
  }, [isOpen, recipientEmail, transferType]);

  useEffect(() => {
    if (!isOpen) {
      setWalletAddress("");
      setIsWalletCreated(false);
    }
  }, [isOpen]);

  const handleCancel = () => {
    setWalletAddress("");
    setIsWalletCreated(false);
    onClose();
  };

  const handleConfirm = () => {
    const addressToConfirm =
      transferType === "eoa" ? recipientEmail : walletAddress;
    onConfirm(addressToConfirm);
    onClose();
  };

  // Create embedded wallet through privy if not exist for specific email
  const handleCreateWallet = async () => {
    setLoading(true);
    try {
      const token = await getAccessToken();

      const response = await fetch("/api/create-privy-wallet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        console.log("Embedded wallet already exists");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    const addressToCopy =
      transferType === "eoa" ? recipientEmail : walletAddress;

    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

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
          <X size={20} className="text-[#FF005C]" />
        </button>

        <div
          className={`flex justify-center items-center lg:p-6 md:p-6 sm:p-6 p-4 rounded-tr-[10px] rounded-tl-[10px] ${
            theme === "dark"
              ? "bg-[#000000] border-b-2 border-[#FE660A]"
              : "bg-white border-b-2 border-[#FE005B]"
          }`}
        >
          <div className="flex items-center flex-col">
            <div className="lg:w-8 lg:h-8 md:w-8 md:h-8 sm:w-8 sm:h-8 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mb-2">
              {theme === "light" ? (
                <Image src={wallet} alt="wallet" />
              ) : (
                <Image src={trx2} alt="wallet" />
              )}
            </div>
            <h2
              className={`text-md lg:text-xl md:text-xl sm:text-xl font-bold ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              {transferType === "eoa"
                ? "Transaction Details"
                : isWalletCreated
                ? "Transaction Details"
                : "Create Wallet"}
            </h2>
          </div>
        </div>

        <div className="p-6">
          {transferType === "eoa" ? (
            <>
              <div className="flex gap-4 mb-4 flex-col w-[100%] lg:w-[80%] md:w-[80%] sm:w-[80%] m-auto">
                <div className="item-start font-semibold">Send</div>

                <p
                  className={`text-sm lg:text-md md:text-md sm:text-md rounded-[12px] text-md py-2 px-4 font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500] bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {tokenAmount} {tokenSymbol} to {recipientEmail}
                </p>

                {isContractCall && (
                  <div
                    className={` text-sm lg:text-md  md:text-md sm:text-md  rounded-[12px] text-md py-2 px-4 font-bold ${
                      theme === "dark"
                        ? "text-[#FFE500]   bg-[#272626] border border-[#3EFEFEF]"
                        : "text-black border border-[#0052FF]"
                    }`}
                  >
                    <ol className="list-none list-inside">
                      <li>
                        <strong>Approve Transaction:</strong>{" "}
                        <span
                          className={`item-start font-semibold ${
                            theme === "dark"
                              ? "text-white   bg-[#272626]"
                              : "text-black"
                          }`}
                        >
                          You will approve{" "}
                          <u>
                            {tokenAmount} {tokenSymbol}
                          </u>{" "}
                          to Transfer.
                        </span>
                      </li>
                      <li>
                        <strong>Execute Transfer:</strong>{" "}
                        <span
                          className={`item-start font-semibold ${
                            theme === "dark"
                              ? "text-white   bg-[#272626]"
                              : "text-black"
                          }`}
                        >
                          You will transfer the approved token to{" "}
                          <u>{recipientEmail}</u>
                        </span>
                      </li>
                    </ol>
                  </div>
                )}

                <div className="item-start font-semibold text-md lg:text-md md:text-md sm:text-md">
                  Recipient Wallet Address
                </div>
                <p
                  className={`text-sm lg:text-md md:text-md sm:text-md rounded-[12px] text-md py-2 px-4 flex justify-between font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500] bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {recipientEmail
                    ? `${recipientEmail.slice(0, 10)}...${recipientEmail.slice(
                        -7
                      )}`
                    : ""}
                  <button
                    className={`p-1 transition-colors ${
                      theme === "dark" ? "text-[#FFE500]" : "text-[#0052FF]"
                    }`}
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-4 sm:h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </p>
              </div>

              <div className="flex gap-5 w-[80%] m-auto">
                <button
                  onClick={handleCancel}
                  className={`${
                    theme === "dark"
                      ? "border border-[#FE660A]"
                      : "border border-[#0052FF] text-[#0052FF]"
                  } w-full text-white py-2 lg:py-3 md:py-3 sm:py-3 rounded-[50px] flex items-center justify-center font-semibold `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`${
                    theme === "dark" ? "bg-[#FE660A]" : "bg-[#0052FF]"
                  } w-full text-white py-2 lg:py-3 md:py-3 sm:py-3 rounded-[50px] flex items-center justify-center font-semibold hover:scale-110 duration-500 transition 0.1`}
                >
                  Confirm
                </button>
              </div>
            </>
          ) : !isWalletCreated ? (
            <div>
              <div className="flex gap-4 mb-2 mt-2 flex-col w-[80%] m-auto">
                <div
                  className={`item-start font-semibold  ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  {checking
                    ? "Searching embedded wallet for"
                    : "A new wallet will be created for"}
                </div>
                <div
                  className={`text-sm lg:text-md  md:text-md sm:text-md  rounded-[12px] text-md py-2 px-4 font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500]  bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  } `}
                >
                  {recipientEmail}
                </div>
                <button
                  onClick={handleCreateWallet}
                  disabled={loading || checking}
                  className={`${
                    theme === "dark" ? "bg-[#FE660A]" : "bg-[#0052FF]"
                  } w-[60%] m-auto text-white py-2 rounded-[10px] flex items-center justify-center mb-2 mt-2 text-sm lg:text-md  md:text-md sm:text-md `}
                >
                  {checking
                    ? "Searching for existing wallet..."
                    : loading
                    ? "Creating..."
                    : "Create Wallet"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 mb-4 flex-col w-[100%] lg:w-[80%] md:w-[80%] sm:w-[80%] m-auto">
                <div className="item-start font-semibold">Send</div>

                <p
                  className={` text-sm lg:text-md  md:text-md sm:text-md  rounded-[12px] text-md py-2 px-4 font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500]   bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {tokenAmount} {tokenSymbol} to {recipientEmail}
                </p>
                {isContractCall && (
                  // <div className="flex gap-4 mb-4 flex-col w-[100%] lg:w-[80%] md:w-[80%] sm:w-[80%] m-auto">
                  <>
                    <div className="item-start font-semibold">
                      Transaction Flow
                    </div>
                    <div
                      className={` text-sm lg:text-md  md:text-md sm:text-md  rounded-[12px] text-md py-2 px-4 font-bold ${
                        theme === "dark"
                          ? "text-[#FFE500]   bg-[#272626] border border-[#3EFEFEF]"
                          : "text-black border border-[#0052FF]"
                      }`}
                    >
                      <ol className="list-none list-inside">
                        <li>
                          <strong>Approve Transaction:</strong>{" "}
                          <span
                            className={`item-start font-semibold ${
                              theme === "dark"
                                ? "text-white   bg-[#272626]"
                                : "text-black"
                            }`}
                          >
                            You will approve{" "}
                            <u>
                              {tokenAmount} {tokenSymbol}
                            </u>{" "}
                            to Transfer.
                          </span>
                        </li>
                        <li>
                          <strong>Execute Transfer:</strong>{" "}
                          <span
                            className={`item-start font-semibold ${
                              theme === "dark"
                                ? "text-white   bg-[#272626]"
                                : "text-black"
                            }`}
                          >
                            You will transfer the approved token to{" "}
                            <u>{recipientEmail}</u>
                          </span>
                        </li>
                      </ol>
                    </div>
                  </>
                  // {/* </div> */}
                )}

                <div className="item-start font-semibold text-md lg:text-md  md:text-md sm:text-md ">
                  {" "}
                  New Wallet for Recipient
                </div>
                <p
                  className={` text-sm lg:text-md  md:text-md sm:text-md  rounded-[12px] text-md py-2 px-4 flex justify-between font-bold ${
                    theme === "dark"
                      ? "text-[#FFE500]  bg-[#272626] border border-[#3EFEFEF]"
                      : "text-black border border-[#0052FF]"
                  }`}
                >
                  {walletAddress
                    ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(
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
                      <CheckCircle className="w-3 h-3 lg:w-4 lg:h-4 md:w-4 md:h-4 sm:w-4 sm:h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </p>
                <div className="text-md lg:text-md  md:text-md sm:text-md font-semibold ">
                  You can check out transaction for transparency.
                </div>
              </div>

              <div className="flex gap-5 w-[80%] m-auto">
                <button
                  onClick={handleCancel}
                  className={`${
                    theme === "dark"
                      ? "border border-[#FE660A]"
                      : "border border-[#0052FF] text-[#0052FF]"
                  } w-full text-white py-2 lg:py-3 md:py-3 sm:py-3 rounded-[50px] flex items-center justify-center font-semibold `}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`${
                    theme === "dark" ? "bg-[#FE660A]" : "bg-[#0052FF]"
                  } w-full text-white py-2 lg:py-3 md:py-3 sm:py-3 rounded-[50px] flex items-center justify-center font-semibold hover:scale-110 duration-500 transition 0.1`}
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

export default TransferDetails;
