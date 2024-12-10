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

// Define a mapping of chain IDs to logos
export const chainLogos: { [key: number]: any } = {
  8453: base,
  291: orderly,
  7560: cyfer,
  7777777: zora,
  34443: mode,
  1135: lisk,
  255: kroma,
  10: op,
  252: fraxtal,
  480: worldChain,
  288: boba,
  185: mint,
  690: redstone,
  360: shape,
  254: swan,
  8866: superlumio,
  1750: metalL2,
  5112: hamchain,
  2192: snaxChain,
  888888888: ancient,
  11155111: sepolia,
};

export const chains = [
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