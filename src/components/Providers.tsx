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
  modeTestnet,
  lisk,
  optimism,
  kroma,
  celo,
  cyber,
  zora,
  orderly,
  sepolia,
  baseSepolia,
  optimismSepolia,
} from "viem/chains";
import { WalletProvider } from "../context/WalletContext";
import { Tooltip } from "antd";

const wagmiConfig = createConfig({
  chains: [
    baseSepolia,
    fraxtal,
    modeTestnet,
    lisk,
    optimismSepolia,
    kroma,
    celo,
    cyber,
    zora,
    orderly,
    sepolia,
  ],
  transports: {
    [modeTestnet.id]: http(),
    [lisk.id]: http(),
    [fraxtal.id]: http(),
    [baseSepolia.id]: http(),
    [optimismSepolia.id]: http(),
    [kroma.id]: http(),
    [celo.id]: http(),
    [cyber.id]: http(),
    [zora.id]: http(),
    [orderly.id]: http(),
    [sepolia.id]: http(),
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

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme: theme === "dark" ? "dark" : "light",
          accentColor: theme === "dark" ? "#000000" : "#E265FF",

          walletList: [
            "metamask",
            "rainbow",
            "wallet_connect",
            "coinbase_wallet",
          ],
        },
        defaultChain: sepolia,
        supportedChains: [
          modeTestnet,
          baseSepolia,
          fraxtal,
          lisk,
          optimismSepolia,
          kroma,
          celo,
          cyber,
          zora,
          orderly,
          sepolia,
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
