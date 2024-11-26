import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

// Import all chain images
import base from "../assets/base.png";
import cyfer from "../assets/cyfer.webp";
import zora from "../assets/zora.png";
import mode from "../assets/mode.webp";
import lisk from "../assets/lisk.webp";
import kroma from "../assets/kroma.webp";
import op from "../assets/op.png";
import fraxtal from "../assets/fraxtal.webp";
import worldChain from "../assets/worldChain.webp";
import boba from "../assets/boba.webp";
import mint from "../assets/mint.png";
import redstone from "../assets/redstone.webp";
import shape from "../assets/shape.jpeg";
import swan from "../assets/swan.webp";
import superlumio from "../assets/superlumio.jpeg";
import metalL2 from "../assets/metalL2.webp";
import hamchain from "../assets/hamChain.jpeg";
import snaxChain from "../assets/snax.png";
import ancient from "../assets/ancient.webp";
import sepolia from "../assets/sepolia.webp";

const chains = [
  { id: 8453, title: "Base", img: base },
  { id: 291, title: "Orderly", img: superlumio },
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

const ChainDropdown: React.FC = () => {
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState<{
    id: number;
    title: string;
    img: any;
  } | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle chain selection
  const handleChainSelect = (chain: {
    id: number;
    title: string;
    img: any;
  }) => {
    setSelectedChain(chain);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <div
        className={`flex items-center space-x-3 p-2 rounded-[10px] cursor-pointer w-full ${
          theme === "dark"
            ? "bg-[#1C1C1C] border border-[#A2A2A2]"
            : "bg-[#F4F3F3] border border-[#C6C6C6]"
        }`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {selectedChain ? (
          <div className="flex items-center">
            <Image
              src={selectedChain.img}
              alt={selectedChain.title}
              width={24}
              height={24}
              className={`mr-2 rounded-full ${
                theme === "dark" ? "bg-white" : "bg-black"
              }`}
            />
            <span className="font-semibold text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
              {selectedChain.title}
            </span>
          </div>
        ) : (
          <span className="font-semibold text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
            Select Chain
          </span>
        )}
        <ChevronDown size={20} color="#FFE500" />
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={`absolute top-12 left-0 w-[200px] rounded-md shadow-lg z-10 max-h-[300px] overflow-y-auto scroll ${
            theme === "dark"
              ? "bg-[#1C1C1C] text-white border border-[#A2A2A2]"
              : "bg-white text-black border border-[#C6C6C6]"
          }`}
        >
          {chains.map((chain) => (
            <div
              key={chain.id}
              onClick={() => handleChainSelect(chain)}
              className={`flex items-center p-2 cursor-pointer hover:bg-gray-100 hover:text-black mb-1 ${
                selectedChain?.id === chain.id ? "bg-gray-200 text-black" : ""
              }`}
            >
              <Image
                src={chain.img}
                alt={chain.title}
                width={24}
                height={24}
                className={`mr-2 rounded-full ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
              {chain.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainDropdown;
