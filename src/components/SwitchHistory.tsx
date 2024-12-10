import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import useOutsideClick from "../lib/useOutsideClick";
import { Tooltip } from "antd";
import { chains } from "../utils/chainIdToLogo";
import sepolia from "../assets/sepolia.webp";

interface SwitchHistoryProps {
  onChainSelect: (selectedChains: number[]) => void;
}

function SwitchHistory({ onChainSelect }: SwitchHistoryProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dropdownRef, () => setDropdownOpen(false));
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

  return (
    <div>
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
                className={`w-[20px] h-[20px] block my-0 mx-auto p-[1px] rounded-[15px] lg:w-[25px] md:w-[20px] lg:h-[25px] md:h-[20px] ${
                  !userHasSelected || selectedChains.includes(chain.id)
                    ? "opacity-100"
                    : "opacity-40"
                } ${theme === "dark" ? "bg-white" : "bg-black"}`}
              />
            </div>
          </Tooltip>
        ))}
      </div>
      <div className=" justify-end items-center hidden sm:hidden lg:flex md:flex ">
        {/* Show Clear All button only when user has made selections */}
        {userHasSelected && (
          <div
            ref={dropdownRef}
            onClick={handleClearAll}
            className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer ${
              theme === "dark" ? "text-[#FFE500] " : "text-[#E265FF] "
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
          </div>
        )}
      </div>

      <div className="md:hidden" ref={dropdownRef}>
        <div className="flex justify-between items-center">
          <div
            className={`w-[100%]  backdrop-blur-[10px]  bg-opacity-50 rounded-xl p-3 mb-1 cursor-pointer flex justify-between items-center outline-none ${
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
                className={`w-[24px] h-[24px] block mr-[10px]  p-[1px] rounded-[15px] text-sm ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
              Select chain
            </div>
            <span>{dropdownOpen ? "▲" : "▼"}</span>
          </div>
          <div className=" justify-end items-center lg:hidden md:hidden flex sm:flex ">
            {/* Show Clear All button only when user has made selections */}
            {userHasSelected && (
              <div
                onClick={handleClearAll}
                className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 cursor-pointer ${
                  theme === "dark" ? "text-[#FFE500] " : "text-[#E265FF] "
                }`}
              >
                Clear
                <span
                  className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                    theme === "dark"
                      ? "bg-[#363535] text-[#FFE500]"
                      : "bg-white text-[#E265FF]"
                  }`}
                >
                  {selectedChains.length}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Dropdown options */}
        {dropdownOpen && (
          <div
            className={`absolute z-10 w-[70%] rounded-xl overflow-scroll mt-1 backdrop-blur-[10px] h-[60vh] ${
              theme === "dark"
                ? "bg-[#000000]/70 border border-white text-white"
                : "bg-[#FFFCFC] border border-gray-700 text-black"
            }`}
          >
            {chains.map((chain) => (
              <div
                key={chain.id}
                className={`flex items-center px-6 py-3 cursor-pointer hover:bg-opacity-80 border-b-2 `}
              >
                <input
                  type="checkbox"
                  id={`chain-${chain.id}`}
                  checked={selectedChains.includes(chain.id)}
                  onChange={() => handleChainClick(chain.id)}
                  className={`mr-4 w-4 h-4 border-gray-300 rounded focus:ring-2 
                    text-yellow-500 ring-yellow-500 
                    ${
                      selectedChains.includes(chain.id)
                        ? "text-yellow-500 ring-yellow-500"
                        : "text-yellow-500 ring-yellow-500"
                    }`}
                />
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[24px] block mr-[20px] p-[1px] rounded-[15px] ${
                    theme === "dark" ? "bg-white" : "bg-black"
                  }`}
                />
                <label htmlFor={`chain-${chain.id}`} className="cursor-pointer">
                  {chain.title}
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SwitchHistory;
