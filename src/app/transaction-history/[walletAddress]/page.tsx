"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TxHistory from "../../history/page";
import WalletAddressPage from "../../dashboard/[walletAddress]/page";
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
    if (isConnected) {
      setShowComponent("txHistory");
    } else if (!walletAddress) {
      // Wallet is connected but no address, show Dashboard
      setShowComponent("dashboard");
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
