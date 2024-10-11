import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "RainbowKit demo",
  projectId: "f8a6524307e28135845a9fe5811fcaa2",
  chains: [ sepolia, mainnet],
  ssr: true,
});
