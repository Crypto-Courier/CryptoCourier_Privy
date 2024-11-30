"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { metaMask } from "wagmi/connectors";

import {
  base,
  fraxtal,
  mode,
  // modeTestnet,
  lisk,
  optimism,
  kroma,
  celo,
  cyber,
  zora,
  orderly,
  sepolia,
  worldchain,
  boba,
  mint,
  redstone,
  ancient8,
  shape,
  swan,
  superlumio,
  metalL2,
  ham,
  snax,
  // baseSepolia,
  // optimismSepolia,
} from "viem/chains";
import { WalletProvider } from "../context/WalletContext";
import { Tooltip } from "antd";

export const wagmiConfig = createConfig({
  chains: [
    base,
    fraxtal,
    mode,
    lisk,
    optimism,
    kroma,
    // celo,
    cyber,
    zora,
    orderly,
    sepolia,
    worldchain,
    boba,
    mint,
    redstone,
    ancient8,
    shape,
    swan,
    superlumio,
    metalL2,
    ham,
    snax
  ],
  transports: {
    [mode.id]: http(),
    [lisk.id]: http(),
    [fraxtal.id]: http(),
    [base.id]: http(),
    [optimism.id]: http(),
    [kroma.id]: http(),
    // [celo.id]: http(),
    [cyber.id]: http(),
    [zora.id]: http(),
    [orderly.id]: http(),
    [sepolia.id]: http(),
    [worldchain.id]: http(),
    [boba.id]: http(),
    [mint.id]: http(),
    [redstone.id]: http(),
    [ancient8.id]: http(),
    [shape.id]: http(),
    [swan.id]: http(),
    [superlumio.id]: http(),
    [metalL2.id]: http(),
    [ham.id]: http(),
    [snax.id]: http(),

  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  // const darkModeConfig = {
  //   appearance: {
  //     theme: "dark" as `#${string}`,
  //     accentColor: "#FFE500" as `#${string}`, // Ensure it conforms to the expected type
  //   },
  // };

  // const lightModeConfig = {
  //   appearance: {
  //     theme: "light" as `#${string}`,
  //     accentColor: "#E265FF" as `#${string}`, // Ensure it conforms to the expected type
  //   },
  // };
  const isDarkMode = theme === "dark";

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: theme === "dark" ? "dark" : "light",

          walletList: [
            "metamask",
            "rainbow",
            "wallet_connect",
            "coinbase_wallet",
          ],
        },
        defaultChain: sepolia,
        supportedChains: [
          mode,
          worldchain,
          base,
          fraxtal,
          lisk,
          optimism,
          kroma,
          // celo,
          cyber,
          zora,
          orderly,
          sepolia,
          boba,
          mint,
          redstone,
          ancient8,
          shape,
          swan,
          superlumio,
          metalL2,
          ham,
          snax
        ],
      }}
    >
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={wagmiConfig}>
          <ThemeProvider attribute="class" defaultTheme="light">
            <WalletProvider>{children}</WalletProvider>
          </ThemeProvider>
        </WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
}
