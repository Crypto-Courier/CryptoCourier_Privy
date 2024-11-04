import React, { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useWallets } from "@privy-io/react-auth";
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
import { Tooltip } from "antd";
import worldChain from "../assets/worldChain.webp";
import boba from "../assets/boba.webp";
import mint from "../assets/mint.png";
import redstone from "../assets/redstone.webp";
import ancient from "../assets/ancient.webp";
import shape from "../assets/shape.jpeg";
import swan from "../assets/swan.webp";
import superlumio from "../assets/superlumio.jpeg";
import  metalL2 from "../assets/metalL2.webp";
import hamchain from "../assets/hamChain.jpeg"
import snaxChain from "../assets/snax.png"

function SwitchNetwork() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [chainSwitchError, setChainSwitchError] = useState("");
  const { theme } = useTheme();
  const { selectedChain, setSelectedChain } = useWallet();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Set default chain if none selected
  useEffect(() => {
    if (!selectedChain && wallet?.chainId) {
      const chainId = parseInt(wallet.chainId.split(":")[1]);
      setSelectedChain(chainId);
    }
  }, [selectedChain, wallet, setSelectedChain]);

  const handleChainSwitch = async (chainId: any) => {
    try {
      await wallet.switchChain(chainId);
      setSelectedChain(chainId);
      setDropdownOpen(false); // Close the dropdown after switching chain
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const chains = [
    { id: 8453, title: "Base", img: base },
    { id: 291, title: "Orderly", img: orderly },
    { id: 7560, title: "Cyber", img: cyfer },
    { id: 7777777, title: "Zora", img: zora },
    // { id: 42220, title: "Celo", img: celo },
    { id: 34443, title: "Mode", img: mode },
    { id: 1135, title: "Lisk", img: lisk },
    { id: 255, title: "Kroma", img: kroma },
    { id: 10, title: "Optimism", img: op },
    { id: 252, title: "Fraxtal", img: fraxtal },
    { id: 480, title: "World Chain", img: worldChain},
    { id: 288, title: "Boba Network", img: boba },
    { id: 185, title: "Mint Blockchain", img: mint},
    { id: 690, title: "Redstone", img: redstone},
    { id: 360, title: "Shape", img: shape},
    { id: 254, title: "Swan Chain", img: swan},
    { id: 8866, title: "Superlumio", img: superlumio},
    { id: 1750, title: "MetalL2", img: metalL2},
    { id: 5112, title: "Ham Chain", img: hamchain},
    { id: 2192, title: "SNAX Chain", img: snaxChain},
    { id: 888888888, title: "Ancient 8", img: ancient},
    { id: 11155111, title: "Ethereum Sepolia", img: sepolia },
  ];

  // Convert chainId to number for comparison
  const currentChain =
    typeof selectedChain === "string" ? parseInt(selectedChain) : selectedChain;

  return (
    <div>
      {/* Responsive layout */}
      <div className="hidden md:flex justify-evenly gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0 border border-gray-500">
        {chains.map((chain) => (
          <Tooltip title={chain.title} key={chain.id}>
            {" "}
            {/* Add Tooltip here */}
            <button
              key={chain.id}
              onClick={() => handleChainSwitch(chain.id)}
              className="border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md"
            >
              <Image
                src={chain.img}
                alt={chain.title}
                className={`w-[24px] h-[25px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                  currentChain === chain.id ? "opacity-100" : "opacity-40"
                } ${theme === "dark" ? "bg-white" : "bg-black"}`}
              />
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Dropdown for small screens */}
      <div className="md:hidden">
        <div
          className={` backdrop-blur-[10px] w-full bg-opacity-50 rounded-xl p-3 mb-1 cursor-pointer flex justify-between items-center outline-none ${
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
                chains.find((chain) => chain.id === currentChain)?.img ||
                sepolia
              }
              alt="Selected Chain"
              className={`w-[24px] h-[24px] block mr-[20px]  p-[1px] rounded-[15px] ${
                theme === "dark" ? "bg-white" : "bg-black"
              }`}
            />
            {chains.find((chain) => chain.id === currentChain)?.title ||
              "Select chain"}
          </div>
          <span>{dropdownOpen ? "▲" : "▼"}</span>
        </div>

        {/* Dropdown options */}
        {dropdownOpen && (
          <div
            className={`absolute z-10 w-full rounded-xl overflow-scroll mt-1 backdrop-blur-[10px] h-[60vh] ${
              theme === "dark"
                ? "bg-[#000000]/70 border border-white text-white"
                : "bg-[#FFFCFC] border border-gray-700 text-black"
            }`}
          >
            {chains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => handleChainSwitch(chain.id)}
                className={`flex  px-6 py-3 cursor-pointer hover:bg-opacity-80 border-b-2 ${
                  currentChain === chain.id ? "bg-opacity-20" : ""
                }`}
              >
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[24px] block mr-[20px]  p-[1px] rounded-[15px] ${
                    currentChain === chain.id ? "opacity-100" : "opacity-40"
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
