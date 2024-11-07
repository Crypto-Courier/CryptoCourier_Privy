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
  const walletAddress = walletData?.address;

  type ComponentType = "txHistory" | "sendToken" | null;
  const [showComponent, setShowComponent] = useState<ComponentType>(null);

  useEffect(() => {
    if (isConnected && walletAddress) {
      // If wallet is connected and address is available, show the Transaction History page
      setShowComponent("txHistory");
    } else if (!walletAddress) {
      // If wallet is connected but no address, show Dashboard page
      setShowComponent("dashboard");
    } else {
      // Handle the case where user is not connected
      setShowComponent("txHistory");
    }
  }, [isConnected, walletAddress]);

  return (
    <div>
      {showComponent === "txHistory" && <TxHistory />}
      {/* {showComponent === "dashboard" && (
        <WalletAddressPage walletAddress={walletAddress} />
      )} */}
    </div>
  );
}

export default TransactionHistory;
