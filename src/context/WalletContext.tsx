import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletContextType {
  walletData: any;
  setWalletData: React.Dispatch<React.SetStateAction<any>>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [walletData, setWalletData] = useState<any>(null);

  return (
    <WalletContext.Provider value={{ walletData, setWalletData }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};