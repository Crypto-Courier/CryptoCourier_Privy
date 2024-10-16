import React, { useState } from "react";
import { Tooltip } from "antd";
import Image from "next/image";
import base from "../assets/base.png";
import derive from "../assets/derive.jpeg";
import bitcoin from "../assets/bitcoin.webp";
import cyfer from "../assets/cyfer.webp";
import fraxtal from "../assets/fraxtal.webp";
import kroma from "../assets/kroma.webp";
import mode from "../assets/mode.webp";
import op from "../assets/op.png";
import zora from "../assets/zora.png";
import lisk from "../assets/lisk.webp";
import {
  usePrivy,
  useLogout,
  getAccessToken,
  useWallets,
} from "@privy-io/react-auth";

function SwitchNetwork() {
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const [chainSwitchError, setChainSwitchError] = useState("");

  const handleChainSwitch = async (chainId: number) => {
    try {
      await wallet.switchChain(chainId);
      setChainSwitchError(""); // Clear any previous errors
    } catch (error) {
      console.error("Failed to switch chain:", error);
      setChainSwitchError("Error switching chains. Please try again.");
    }
  };

  return (
    <div>
      {" "}
      <div className="justify-evenly flex gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm bg-[#0A0A0A]/80 backdrop-blur-[80px] w-full basis-full shrink-0 border border-gray-500">
        <Tooltip title="Base">
          <button
            onClick={() => handleChainSwitch(8453)} // Base chain ID
            className="border-0 cursor-pointer p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={base}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="bitcoin">
          <button
            onClick={() => handleChainSwitch(1)} // Chain ID for Bitcoin (as an example)
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={bitcoin}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Cyber">
          <button
            onClick={() => handleChainSwitch(123)} // Cyber chain ID
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={cyfer}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Zora">
          <button
            onClick={() => handleChainSwitch(7777777)} // Zora chain ID
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={zora}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Derive">
          <button
            onClick={() => handleChainSwitch(5555)} // Derive chain ID
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={derive}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Mode">
          <button
            onClick={() => handleChainSwitch(34443)}
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={mode}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Lisk">
          <button
            onClick={() => handleChainSwitch(4100)}
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={lisk}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Kroma">
          <button
            onClick={() => handleChainSwitch(255)}
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={kroma}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="optimism">
          <button
            onClick={() => handleChainSwitch(10)} // Optimism chain ID
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={op}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Fraxtal">
          <button
            onClick={() => handleChainSwitch(1)}
            className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md"
          >
            <Image
              src={fraxtal}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default SwitchNetwork;
