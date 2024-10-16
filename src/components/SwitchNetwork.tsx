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

  const handleChainSwitch = async () => {
    try {
      // Switch to chain ID 7777777
      await wallet.switchChain(11155111);
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
            onClick={handleChainSwitch}
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
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={bitcoin}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Cyber">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={cyfer}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Zora">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={zora}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Derive">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={derive}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Mode">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={mode}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Lisk">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={lisk}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Kroma">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={kroma}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="optimism">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
            <Image
              src={op}
              alt=""
              className="w-[24px] h-[25px] block my-0 mx-auto bg-white p-[1px] rounded-[15px]"
            />
          </button>
        </Tooltip>
        <Tooltip title="Fraxtal">
          <button className="border-0 cursor-pointer p-[6px_0px] relative  bg-transparent shadow-none shrink-0 rounded-md">
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
