"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { PrivyProvider } from '@privy-io/react-auth';
import { ThemeProvider } from "next-themes";
import "@rainbow-me/rainbowkit/styles.css";

import { config } from "../../wagmi";

const myCustomTheme = {
  blurs: {
    modalOverlay: "blur(5px)",
  },
  colors: {
    accentColor: "#FF3333",
    accentColorForeground: "white",
    actionButtonBorder: "rgba(255, 255, 255, 0.15)",
    actionButtonBorderMobile: "rgba(255, 255, 255, 0.25)",
    actionButtonSecondaryBackground: "#FF3333",
    closeButton: "rgba(224, 232, 255, 0.8)",
    closeButtonBackground: "transaperent",
    connectButtonBackground: "#FF3333",
    connectButtonBackgroundError: "#FF494A",
    connectButtonInnerBackground: "#FF3333",
    connectButtonText: "#FFF",
    connectButtonTextError: "#FFF",
    connectionIndicator: "#30E000",
    downloadBottomCardBackground:
      "linear-gradient(126deg, rgba(0, 0, 0, 0.3) 9.49%, rgba(120, 120, 120, 0.4) 71.04%), #1A1B1F",
    downloadTopCardBackground:
      "linear-gradient(126deg, rgba(120, 120, 120, 0.4) 9.49%, rgba(0, 0, 0, 0.3) 71.04%), #1A1B1F",
    error: "#FF494A",
    generalBorder: "rgba(255, 255, 255, 0.25)",
    generalBorderDim: "rgba(255, 255, 255, 0.15)",
    menuItemBackground: "rgba(224, 232, 255, 0.3)",
    modalBackdrop: "rgba(0, 0, 0, 0.7)",
    modalBackground:
      "linear-gradient(112.07deg, #161515 26.66%, #252525 87.79%)",
    modalBorder: "#FF3333",
    modalText: "#FFF",
    modalTextDim: "rgba(224, 232, 255, 0.5)",
    modalTextSecondary: "rgba(255, 255, 255, 0.8)",
    profileAction: "rgba(224, 232, 255, 0.3)",
    profileActionHover: "rgba(224, 232, 255, 0.4)",
    profileForeground:
      "linear-gradient(112.07deg, #161515 26.66%, #252525 87.79%)",
    selectedOptionBorder: "rgba(224, 232, 255, 0.3)",
    standby: "#FFD641",
  },
  fonts: {
    body: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol",
  },
  radii: {
    actionButton: "4px",
    connectButton: "20px",
    menuButton: "4px",
    modal: "8px",
    modalMobile: "8px",
  },
  shadows: {
    connectButton: "0px 4px 12px rgba(0, 0, 0, 0.3)",
    dialog: "0px 8px 32px rgba(0, 0, 0, 0.5)",
    profileDetailsAction: "0px 2px 6px rgba(37, 41, 46, 0.2)",
    selectedOption: "0px 2px 6px rgba(0, 0, 0, 0.4)",
    selectedWallet: "0px 2px 6px rgba(0, 0, 0, 0.4)",
    walletLogo: "0px 2px 16px rgba(0, 0, 0, 0.3)",
  },
};

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
      <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'light',
          accentColor: '#676FFF',
          // You can customize other appearance options here
        },
        // Add any other Privy configuration options here
      }}
    >
        <RainbowKitProvider theme={myCustomTheme}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
          </ThemeProvider>
        </RainbowKitProvider>
        </PrivyProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
