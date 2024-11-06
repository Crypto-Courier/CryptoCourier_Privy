"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TxHistory from "../history/page";
import WalletAddressPage from "../dashboard/[walletAddress]/page";
import { useWallet } from "../../context/WalletContext";
import { usePrivy } from "@privy-io/react-auth"; // Assuming Privy for email login
import SendToken from "../send-token/page";

function TransactionHistory() {
  const router = useRouter();
  const { walletData } = useWallet();
  const isConnected = walletData?.authenticated;
  const activeAddress = walletData?.address;

  // Explicitly typing the state to accept specific strings or null
  const [showComponent, setShowComponent] = useState<
    "dashboard" | "txHistory" | "sendToken" | null
  >(null);

  useEffect(() => {
    if (isConnected) {
      // If wallet is connected and address is available, show the Dashboard page
      setShowComponent("txHistory");
    } else {
      // If wallet is connected but no address, show transaction history
      setShowComponent("dashboard");
    }
  }, [isConnected]);

  return (
    <div>
      {showComponent === "txHistory" && <TxHistory />}
      {showComponent === "dashboard" && (
        <WalletAddressPage activeAddress={activeAddress} />
      )}
    </div>
  );
}

export default TransactionHistory;
