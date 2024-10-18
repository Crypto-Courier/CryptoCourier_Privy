import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext"; // Import your context
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
import sepolia from "../assets/sepolia.webp";
import lisk from "../assets/lisk.webp";
import { useWallets } from "@privy-io/react-auth";

function SwitchNetwork() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [chainSwitchError, setChainSwitchError] = useState("");
  const { theme } = useTheme();
  const { selectedChain, setSelectedChain } = useWallet(); // Get setSelectedChain from context

  // Default chain set to Sepolia (11155111)
  useEffect(() => {
    if (!selectedChain) {
      setSelectedChain(11155111); // Set default to Sepolia if no chain is selected
    }
  }, [selectedChain, setSelectedChain]);

  const handleChainSwitch = async (chainId: number) => {
    try {
      await wallet.switchChain(chainId);
      setSelectedChain(chainId); // Update the selected chain in the context
      setChainSwitchError(""); // Clear any previous errors
      setDropdownOpen(false); // Close the dropdown after selecting
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
    { id: 11155111, title: "Ethereum Sepolia", img: sepolia },
  ];

  return (
    <div>
      {/* Responsive layout */}
      <div className="hidden md:flex justify-evenly gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0 border border-gray-500">
        {chains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => handleChainSwitch(chain.id)}
            className="border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={chain.img}
              alt={chain.title}
              className={`w-[24px] h-[25px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                selectedChain === chain.id ? "opacity-100" : "opacity-40"
              } ${theme === "dark" ? "bg-white" : "bg-black"}`}
            />
          </button>
        ))}
      </div>

      {/* Dropdown for small screens */}
      <div className="md:hidden">
        <div
          className={` backdrop-blur-[10px] w-full bg-opacity-50 rounded-xl p-3 mb-3 cursor-pointer flex justify-between items-center outline-none ${
            theme === "dark"
              ? "bg-[#000000]/50 border border-white text-white"
              : "bg-[#FFFCFC] border border-gray-700 text-black"
          }`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="flex items-center">
            {/* Display the currently selected chain */}
            <Image
              src={
                chains.find((chain) => chain.id === selectedChain)?.img || base
              }
              alt="Selected Chain"
              className="w-6 h-6 mr-2"
            />
            {chains.find((chain) => chain.id === selectedChain)?.title ||
              "Select chain"}
          </div>
          <span>{dropdownOpen ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown options */}
        {dropdownOpen && (
          <div
            className={`absolute z-10 w-full rounded-xl overflow-hidden mt-1 backdrop-blur-[10px] ${
              theme === "dark"
                ? "bg-[#000000]/70 border border-white text-white"
                : "bg-[#FFFCFC] border border-gray-700 text-black"
            }`}
          >
            {chains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => handleChainSwitch(chain.id)}
                className={`flex  px-6 py-2 cursor-pointer hover:bg-opacity-80 border-b-2 ${
                  selectedChain === chain.id ? "bg-opacity-20" : ""
                }`}
              >
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[25px] block mr-[20px]  p-[1px] rounded-[15px] ${
                    selectedChain === chain.id ? "opacity-100" : "opacity-40"
                  } ${theme === "dark" ? "bg-white" : "bg-black"}`}
                />
                {chain.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {chainSwitchError && <p className="text-red-500">{chainSwitchError}</p>}
    </div>
  );
}

export default SwitchNetwork;
