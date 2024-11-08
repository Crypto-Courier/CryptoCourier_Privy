"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TxHistory from "../../history/page";
import WalletAddressPage from "../../dashboard/page";
import { useWallet } from "../../../context/WalletContext";
import { usePrivy } from "@privy-io/react-auth"; // Assuming Privy for email login
import SendToken from "../../send-token/page";

function TransactionHistory() {
  const router = useRouter();
  const { walletData } = useWallet();
  const isConnected = walletData?.authenticated;
  const walletAddress = walletData?.address;

  const [showComponent, setShowComponent] = useState<
    "dashboard" | "txHistory" | "sendToken" | null
  >(null);

  useEffect(() => {
    const source = new URLSearchParams(window.location.search).get("source");

    if (source === "email") {
      // Redirect to Dashboard if the source is 'email'
      setShowComponent("dashboard");
    } else if (source === "wallet" && walletAddress) {
      // Redirect to Transaction History if the source is 'wallet'
      setShowComponent("txHistory");
    } else {
      // Default behavior based on wallet connection status
      if (isConnected && walletAddress) {
        setShowComponent("txHistory");
      } else if (!isConnected && walletAddress) {
        setShowComponent("dashboard");
      }
    }
  }, [isConnected, walletAddress]);

  return (
    <div>
      {showComponent === "txHistory" && <TxHistory />}
      {showComponent === "dashboard" && walletAddress && (
        <WalletAddressPage params={{ walletAddress }} />
      )}
    </div>
  );
}

export default TransactionHistory;
