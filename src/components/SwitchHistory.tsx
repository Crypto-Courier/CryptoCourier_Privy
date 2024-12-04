import React, { useState } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Tooltip } from "antd";

import base from "../assets/base.png";
import orderly from "../assets/orderly.jpeg";
import cyfer from "../assets/cyfer.webp";
import fraxtal from "../assets/fraxtal.webp";
import kroma from "../assets/kroma.webp";
import mode from "../assets/mode.webp";
import op from "../assets/op.png";
import zora from "../assets/zora.png";
import sepolia from "../assets/sepolia.webp";
import lisk from "../assets/lisk.webp";
import worldChain from "../assets/worldChain.webp";
import boba from "../assets/boba.webp";
import mint from "../assets/mint.png";
import redstone from "../assets/redstone.webp";
import ancient from "../assets/ancient.webp";
import shape from "../assets/shape.jpeg";
import swan from "../assets/swan.webp";
import superlumio from "../assets/superlumio.jpeg";
import metalL2 from "../assets/metalL2.webp";
import hamchain from "../assets/hamChain.jpeg";
import snaxChain from "../assets/snax.png";

interface SwitchHistoryProps {
  onChainSelect: (selectedChains: number[]) => void;
}

function SwitchHistory({ onChainSelect }: SwitchHistoryProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { theme } = useTheme();
  const [userHasSelected, setUserHasSelected] = useState(false);
  const [selectedChains, setSelectedChains] = useState<number[]>([
    8453, 919, 34443, 11155111, 291, 7560, 7777777, 1135, 255, 10, 252, 480,
    288, 185, 690, 360, 254, 8866, 1750, 5112, 2192, 888888888,
  ]);

  const handleChainClick = (chainId: number) => {
    if (!userHasSelected) {
      // First click - select only this chain
      setUserHasSelected(true);
      setSelectedChains([chainId]);
      onChainSelect([chainId]);
    } else {
      // Subsequent clicks
      if (selectedChains.includes(chainId)) {
        // If chain is already selected and it's the only one selected,
        // reset to all chains
        if (selectedChains.length === 1) {
          setUserHasSelected(false);
          const allChains = chains.map((chain) => chain.id);
          setSelectedChains(allChains);
          onChainSelect(allChains);
        } else {
          // Remove this chain from selection
          const newSelected = selectedChains.filter((id) => id !== chainId);
          setSelectedChains(newSelected);
          onChainSelect(newSelected);
        }
      } else {
        // Add this chain to selection
        const newSelected = [...selectedChains, chainId];
        setSelectedChains(newSelected);
        onChainSelect(newSelected);
      }
    }
  };

  const handleClearAll = () => {
    setUserHasSelected(false);
    const allChains = chains.map((chain) => chain.id);
    setSelectedChains(allChains);
    onChainSelect(allChains);
  };

  const chains = [
    { id: 8453, title: "Base", img: base },
    { id: 291, title: "Orderly", img: orderly },
    { id: 7560, title: "Cyber", img: cyfer },
    { id: 7777777, title: "Zora", img: zora },
    { id: 34443, title: "Mode", img: mode },
    { id: 1135, title: "Lisk", img: lisk },
    { id: 255, title: "Kroma", img: kroma },
    { id: 10, title: "Optimism", img: op },
    { id: 252, title: "Fraxtal", img: fraxtal },
    { id: 480, title: "World Chain", img: worldChain },
    { id: 288, title: "Boba Network", img: boba },
    { id: 185, title: "Mint Blockchain", img: mint },
    { id: 690, title: "Redstone", img: redstone },
    { id: 360, title: "Shape", img: shape },
    { id: 254, title: "Swan Chain", img: swan },
    { id: 8866, title: "Superlumio", img: superlumio },
    { id: 1750, title: "MetalL2", img: metalL2 },
    { id: 5112, title: "Ham Chain", img: hamchain },
    { id: 2192, title: "SNAX Chain", img: snaxChain },
    { id: 888888888, title: "Ancient 8", img: ancient },
    { id: 11155111, title: "Ethereum Sepolia", img: sepolia },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        {/* Show Clear All button only when user has made selections */}
        {userHasSelected && (
          <button
            onClick={handleClearAll}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition duration-300 hover:scale-105 ${
              theme === "dark"
                ? "bg-[#FFE500] text-[#363535]"
                : "bg-[#E265FF] text-white"
            }`}
          >
            Clear All
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                theme === "dark"
                  ? "bg-[#363535] text-[#FFE500]"
                  : "bg-white text-[#E265FF]"
              }`}
            >
              {selectedChains.length}
            </span>
          </button>
        )}
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex justify-evenly gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0 border border-gray-500">
        {chains.map((chain) => (
          <Tooltip title={chain.title} key={chain.id}>
            <div
              onClick={() => handleChainClick(chain.id)}
              className={`border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md ${
                selectedChains.includes(chain.id) ? "scale-110" : ""
              }`}
            >
              <Image
                src={chain.img}
                alt={chain.title}
                className={`w-[24px] h-[25px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                  !userHasSelected || selectedChains.includes(chain.id)
                    ? "opacity-100"
                    : "opacity-40"
                } ${theme === "dark" ? "bg-white" : "bg-black"}`}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Mobile view */}
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
              src={sepolia}
              alt="Selected Chain"
              className={`w-[24px] h-[24px] block mr-[20px]  p-[1px] rounded-[15px] ${
                theme === "dark" ? "bg-white" : "bg-black"
              }`}
            />
            Select chain
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
                className={`flex  px-6 py-3 cursor-pointer hover:bg-opacity-80 border-b-2 `}
              >
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[24px] block mr-[20px]  p-[1px] rounded-[15px] ${
                    theme === "dark" ? "bg-white" : "bg-black"
                  }`}
                />
                {chain.title}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SwitchHistory;
