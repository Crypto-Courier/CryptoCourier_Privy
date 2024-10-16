"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { PrivyProvider } from "@privy-io/react-auth";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { sepolia, mainnet } from "viem/chains";
import { WalletProvider } from "../context/WalletContext";

const wagmiConfig = createConfig({
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  const darkModeConfig = {
    appearance: {
      theme: "dark" as `#${string}`,
      accentColor: "#FFE500" as `#${string}`, // Ensure it conforms to the expected type
    },
  };

  const lightModeConfig = {
    appearance: {
      theme: "light" as `#${string}`,
      accentColor: "#E265FF" as `#${string}`, // Ensure it conforms to the expected type
    },
  };

  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email", "wallet"],
        appearance: {
          theme:
            theme === "dark"
              ? darkModeConfig.appearance.theme
              : lightModeConfig.appearance.theme,
          accentColor:
            theme === "dark"
              ? darkModeConfig.appearance.accentColor
              : lightModeConfig.appearance.accentColor,
          walletList: [
            "metamask",
            "rainbow",
            "wallet_connect",
            "coinbase_wallet",
          ],
        },
        defaultChain: mainnet,
        supportedChains: [mainnet, sepolia],
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
