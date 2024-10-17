import React, { createContext, useContext, useState, ReactNode } from "react";

// Define the types for wallet data and selectedChain
interface WalletContextType {
  walletData: any;
  setWalletData: React.Dispatch<React.SetStateAction<any>>;
  selectedChain: any;
  setSelectedChain: React.Dispatch<React.SetStateAction<number | null>>;
}

// Initialize context with undefined to enforce its usage within a provider
const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [walletData, setWalletData] = useState<any>(null);
  const [selectedChain, setSelectedChain] = useState<number | null>(null); // Typed as number or null

  return (
    <WalletContext.Provider
      value={{ walletData, setWalletData, selectedChain, setSelectedChain }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
