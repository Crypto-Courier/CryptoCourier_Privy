import React from "react";
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

function SwitchHistory() {
  const { theme } = useTheme();

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
      {/* Desktop view */}
      <div className="hidden md:flex justify-evenly gap-y-4 gap-x-0 flex-nowrap flex-row rounded-sm w-full basis-full shrink-0 border border-gray-500">
        {chains.map((chain) => (
          <Tooltip title={chain.title} key={chain.id}>
            <div className="border-0 cursor-default p-[6px_0px] relative bg-transparent shadow-none shrink-0 rounded-md">
              <Image
                src={chain.img}
                alt={chain.title}
                className={`w-[24px] h-[25px] block my-0 mx-auto p-[1px] rounded-[15px] opacity-40 ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
            </div>
          </Tooltip>
        ))}
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <div
          className={`backdrop-blur-[10px] w-full bg-opacity-50 rounded-xl p-3 mb-1 flex justify-center items-center outline-none ${
            theme === "dark"
              ? "bg-[#000000]/50 border border-white text-white"
              : "bg-[#FFFCFC] border border-gray-700 text-black"
          }`}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {chains.map((chain) => (
              <div key={chain.id} className="flex items-center">
                <Image
                  src={chain.img}
                  alt={chain.title}
                  className={`w-[24px] h-[24px] block p-[1px] rounded-[15px] opacity-40 ${
                    theme === "dark" ? "bg-white" : "bg-black"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default SwitchHistory;
