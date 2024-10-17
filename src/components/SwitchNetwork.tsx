import React, { useState } from "react";
import { useWallet } from "../context/WalletContext"; // Import your context

import { Tooltip } from "antd";
import { useTheme } from "next-themes";
import Image from "next/image";
import base from "../assets/base.png";
import celo from "../assets/celo.jpeg";
import orderly from "../assets/orderly.jpeg";
import cyfer from "../assets/cyfer.webp";
import fraxtal from "../assets/fraxtal.webp";
import kroma from "../assets/kroma.webp";
import mode from "../assets/mode.webp";
import op from "../assets/op.png";
import zora from "../assets/zora.png";
import derive from "../assets/derive.jpeg";

import lisk from "../assets/lisk.webp";
import { useWallets } from "@privy-io/react-auth";

function SwitchNetwork() {
  const { wallets } = useWallets();
  const wallet = wallets[0];

  const [chainSwitchError, setChainSwitchError] = useState("");
  const { theme } = useTheme();
  const { selectedChain, setSelectedChain } = useWallet(); // Get setSelectedChain from context

  const handleChainSwitch = async (chainId: number) => {
    try {
      await wallet.switchChain(chainId);
      setSelectedChain(chainId); // Update the selected chain in the context
      setChainSwitchError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setChainSwitchError("Error switching chains. Please try again.");
    }
  };

  const chains = [
    { id: 8453, title: "Base", img: base },
    { id: 291, title: "Orderly", img: orderly },
    { id: 7560, title: "Cyber", img: cyfer },
    { id: 7777777, title: "Zora", img: zora },
    { id: 42220, title: "Celo", img: celo },
    { id: 34443, title: "Mode", img: mode },
    { id: 1135, title: "Lisk", img: lisk },
    { id: 255, title: "Kroma", img: kroma },
    { id: 10, title: "Optimism", img: op },
    { id: 252, title: "Fraxtal", img: fraxtal },
  ];

  return (
    <div>
      <div
        className={`justify-evenly flex gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0 border border-gray-500${
          theme === "dark"
            ? " bg-[#0A0A0A]/80 backdrop-blur-[80px]"
            : " bg-[#FFFCFC]"
        }`}
      >
        {chains.map((chain) => (
          <Tooltip title={chain.title} key={chain.id}>
            <button
              onClick={() => handleChainSwitch(chain.id)}
              className="border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md"
            >
              <Image
                src={chain.img}
                alt={chain.title}
                className={`w-[24px] h-[25px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                  selectedChain === chain.id ? "opacity-100" : "opacity-40 "
                } ${theme === "dark" ? "bg-white" : "bg-black"}`}
              />
            </button>
          </Tooltip>
        ))}
      </div>
      {chainSwitchError && <p className="text-red-500">{chainSwitchError}</p>}
    </div>
  );
}

export default SwitchNetwork;
