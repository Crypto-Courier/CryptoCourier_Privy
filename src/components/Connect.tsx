import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  usePrivy,
  useLogout,
  getAccessToken,
  useWallets,
} from "@privy-io/react-auth";

import { useWallet } from "../context/WalletContext";

export const Connect = () => {
  const { setWalletData } = useWallet();
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { login, authenticated, ready, user, connectWallet } = usePrivy();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [chainSwitchError, setChainSwitchError] = useState("");
  const chainDropdownRef = useRef<HTMLDivElement | null>(null);
  const walletDropdownRef = useRef<HTMLDivElement | null>(null);

  const { logout } = useLogout({
    onSuccess: () => {
      setIsWalletConnected(false);
    },
  });

  const checkWalletConnection = useCallback(() => {
    if (authenticated && user) {
      const connectedWallets =
        user.linkedAccounts?.filter((account) => account.type === "wallet") ||
        [];
      setIsWalletConnected(connectedWallets.length > 0);
    } else {
      setIsWalletConnected(false);
    }
  }, [authenticated, user]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  useEffect(() => {
    if (authenticated && user) {
      const updateWalletData = async () => {
        setWalletData({
          address: wallet.address,
          chainId: wallet.chainId,
          authenticated: authenticated,
          user: user,
        });
      };

      updateWalletData();
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
      setWalletData(null);
    }
  }, [authenticated, user, setWalletData]);

  if (!ready) {
    return (
      <div
        className="opacity-0 pointer-events-none user-select-none"
        aria-hidden="true"
      >
        Loading...
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  if (!isWalletConnected) {
    return (
      <button
        onClick={handleConnect}
        type="button"
        className="border border-[#FFFFFF] w-50 bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
      >
        Connect Wallet
      </button>
    );
  }

  const mainWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  );

  return (
    <div className="flex gap-4">
      <div className="relative">
        <button className="border border-[#FFFFFF] bg-[#FF3333] py-3 px-4 rounded-full lg:w-48 md:w-48 sm:w-48 w-30 font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center">
          {wallet.chainId}
        </button>
      </div>

      <div className="relative" ref={walletDropdownRef}>
        <button
          type="button"
          className="border border-[#FFFFFF] lg:w-50 md:w-50 sm:w-50 w-30 bg-[#FF3333] py-3 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
        >
          {mainWallet ? (
            <>
              {mainWallet.address.slice(0, 6)}...{mainWallet.address.slice(-4)}
              {/* <span className="hidden sm:inline-block">
                ({balance?.formatted.slice(0, 4)} {balance?.symbol})
              </span> */}
            </>
          ) : (
            "Connected"
          )}
        </button>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  );
};
