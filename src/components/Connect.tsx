import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePrivy, useLogout, useWallets } from "@privy-io/react-auth";
import { useTheme } from "next-themes";
import { useWallet } from "../context/WalletContext";
import { Tooltip } from "antd";

// Import chain images
import base from "../assets/base.png";
import celo from "../assets/celo.jpeg";
import orderly from "../assets/orderly.jpeg";
import cyfer from "../assets/cyfer.webp";
import fraxtal from "../assets/fraxtal.webp";
import kroma from "../assets/kroma.webp";
import mode from "../assets/mode.webp";
import op from "../assets/op.png";
import zora from "../assets/zora.png";
import lisk from "../assets/lisk.webp";
import sepolia from "../assets/sepolia.webp";

const chainImages: { [key: number]: any } = {
  8453: base,
  291: orderly,
  7560: cyfer,
  7777777: zora,
  42220: celo,
  34443: mode,
  1135: lisk,
  255: kroma,
  10: op,
  252: fraxtal,
  11155111: sepolia,
};

const chainNames: { [key: number]: string } = {
  8453: "Base",
  291: "Orderly",
  7560: "Cyber",
  7777777: "Zora",
  42220: "Celo",
  34443: "Mode",
  1135: "Lisk",
  255: "Kroma",
  10: "Optimism",
  252: "Fraxtal",
  11155111: "Sepolia",
};

export const Connect = () => {
  const { setWalletData, selectedChain } = useWallet(); // Get selectedChain from context
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { theme } = useTheme();
  const { login, authenticated, ready, user, connectWallet } = usePrivy();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
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
        if (wallet) {
          setWalletData({
            address: wallet.address,
            chainId: wallet.chainId,

            authenticated: authenticated,
            user: user,
          });
        }
      };

      updateWalletData();
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
      setWalletData(null);
    }
  }, [authenticated, user, setWalletData, wallet]);

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
      <div className="relative" ref={walletDropdownRef}>
        <button
          onClick={logout}
          type="button"
          className="border border-[#FFFFFF] lg:w-50 md:w-50 sm:w-50 w-30 bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-[12px] flex items-center justify-center gap-2"
        >
          {/* Chain Image */}
          <Tooltip
            title={
              selectedChain && chainNames[selectedChain]
                ? chainNames[selectedChain]
                : "Chain"
            }
          >
            {selectedChain && chainImages[selectedChain] ? (
              <img
                src={chainImages[selectedChain].src} // Use .src if using StaticImageData
                alt={`Chain ${selectedChain}`}
                className={`w-[20px] h-[20px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
            ) : (
              selectedChain
            )}
          </Tooltip>

          {/* Wallet Address */}
          <Tooltip title="Disconnect on click">
            {mainWallet ? (
              <>
                {mainWallet.address.slice(0, 6)}...
                {mainWallet.address.slice(-4)}
              </>
            ) : (
              "Connected"
            )}
          </Tooltip>
        </button>
      </div>
    </div>
  );
};
