import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import useOutsideClick from "../hooks/useOutsideClick";
import { Tooltip } from "antd";
import { chains } from "../utils/chainIdToLogo";
import sepolia from "../assets/sepolia.webp";

interface FilterChainDataProps {
  onChainSelect: (selectedChains: number[]) => void;
  selectedChains: number[];
  userHasSelected: boolean;
  onUserSelectChange: (hasSelected: boolean) => void;
}

const FilterChainData: React.FC<FilterChainDataProps> = ({ 
  onChainSelect, 
  selectedChains, 
  userHasSelected, 
  onUserSelectChange 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));
  const { theme } = useTheme();

  const handleChainClick = (chainId: number) => {
    if (selectedChains.includes(chainId) && userHasSelected) {
      // If clicking the currently selected chain, reset to all chains
      handleClearAll();
    } else {
      // Select only this chain
      onUserSelectChange(true);
      onChainSelect([chainId]);
    }
  };

  const handleClearAll = () => {
    onUserSelectChange(false);
    const allChains = chains.map((chain) => chain.id);
    onChainSelect(allChains);
  };

  return (
    <div className={`items-center rounded-md backdrop-blur-[20px] mb-2 py-1 relative sm:z-[100] lg:z-0 md:z-0 z-[100] ${
      theme === "dark"
        ? "lg:bg-[#000000]/70 lg:border lg:border-[#ddcb2cb2] sm:border-none md:border-none"
        : "lg:bg-[#000000]/70 lg:border border-[#FFFFFF] sm:border-none md:border-none"
    }`}>
      <div className="hidden md:flex justify-evenly gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0">
        {chains.map((chain) => (
          <Tooltip title={chain.title} key={chain.id}>
            <div
              onClick={() => handleChainClick(chain.id)}
              className={`border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md ${
                selectedChains.includes(chain.id) && userHasSelected ? "scale-110" : ""
              }`}
            >
              <Image
                src={chain.img}
                alt={chain.title}
                className={`w-[20px] h-[20px] block my-0 mx-auto p-[1px] rounded-[15px] lg:w-[25px] md:w-[20px] lg:h-[25px] md:h-[20px] ${
                  !userHasSelected || selectedChains.includes(chain.id)
                    ? "opacity-100"
                    : "opacity-40"
                } ${theme === "dark" ? "bg-white" : "bg-black"}
                ${selectedChains.includes(chain.id) && userHasSelected ? "border-2 border-yellow-400" : ""}`}
              />
            </div>
          </Tooltip>
        ))}
        {userHasSelected && (
          <div className="justify-end items-center hidden sm:hidden lg:flex md:flex">
            <div
              onClick={handleClearAll}
              className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer ${
                theme === "dark" ? "text-[#FFE500]" : "text-[#E265FF]"
              }`}
            >
              Clear All
            </div>
          </div>
        )}
      </div>
      
      {/* Mobile View */}
      <div className="md:hidden z-50" ref={dropdownRef}>
        <div className="flex justify-between items-center">
          <div
            className={`w-full backdrop-blur-[10px] bg-opacity-50 rounded-xl p-3 mb-1 cursor-pointer flex justify-between items-center ${
              theme === "dark"
                ? "bg-[#000000]/50 border border-white text-white"
                : "bg-[#FFFCFC] border border-gray-700 text-black"
            }`}
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="flex items-center">
              <Image
                src={userHasSelected && selectedChains.length === 1 
                  ? chains.find(chain => chain.id === selectedChains[0])?.img || sepolia
                  : sepolia}
                alt="Selected Chain"
                className={`w-[24px] h-[24px] mr-[10px] p-[1px] rounded-[15px] ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
              {userHasSelected && selectedChains.length === 1 
                ? chains.find(chain => chain.id === selectedChains[0])?.title
                : "Select chain"}
            </div>
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </div>
          {userHasSelected && (
            <div onClick={handleClearAll} className={`px-4 py-2 rounded-full text-sm cursor-pointer ${
              theme === "dark" ? "text-[#FFE500]" : "text-[#E265FF]"
            }`}>
              Clear
            </div>
          )}
        </div>

        {dropdownOpen && (
          <div className={`absolute w-[70%] rounded-xl overflow-scroll mt-1 backdrop-blur-[10px] h-[42vh] ${
            theme === "dark"
              ? "bg-[#000000]/70 border border-white text-white"
              : "bg-[#FFFCFC] border border-gray-700 text-black"
          }`}>
            {chains.map((chain) => (
              <div
                key={chain.id}
                onClick={() => {
                  handleChainClick(chain.id);
                  setDropdownOpen(false);
                }}
                className={`flex items-center px-6 py-3 cursor-pointer hover:bg-opacity-80 border-b-2 ${
                  selectedChains.includes(chain.id) && userHasSelected ? "bg-opacity-20 bg-yellow-400" : ""
                }`}
              >
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[24px] mr-[20px] p-[1px] rounded-[15px] ${
                    theme === "dark" ? "bg-white" : "bg-black"
                  }`}
                />
                <span>{chain.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterChainData;