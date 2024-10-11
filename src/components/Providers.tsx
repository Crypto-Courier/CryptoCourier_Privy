"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { sepolia, mainnet } from "viem/chains";

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

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
          config={{
            loginMethods: ['email', 'wallet'],
            appearance: {
             theme: theme === "dark" ? "dark" : "light",
          accentColor: theme === "dark" ? "#FFE500" : "#E265FF",
              walletList: ['metamask', 'rainbow', 'wallet_connect', 'coinbase_wallet'],
            },
            defaultChain: sepolia,
            supportedChains: [mainnet, sepolia]
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
