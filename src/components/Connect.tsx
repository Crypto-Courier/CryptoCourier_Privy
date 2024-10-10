import React, { useEffect, useState, useCallback } from 'react';
import { usePrivy, useLogout } from '@privy-io/react-auth';
import { useDisconnect } from 'wagmi';

export const Connect = () => {
  const { 
    login, 
    authenticated, 
    ready, 
    user,
    connectWallet,
  } = usePrivy();

  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const { logout } = useLogout({
    onSuccess: () => {
      setIsWalletConnected(false);
    },
  });

  const { disconnect: wagmiDisconnect } = useDisconnect();

  const checkWalletConnection = useCallback(() => {
    if (authenticated && user) {
      const connectedWallets = user.linkedAccounts?.filter(account => account.type === 'wallet') || [];
      setIsWalletConnected(connectedWallets.length > 0);
    } else {
      setIsWalletConnected(false);
    }
  }, [authenticated, user]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  useEffect(() => {
    // Listen for external wallet disconnection
    window.ethereum?.on('accountsChanged', (accounts: string[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
      } else {
        checkWalletConnection();
      }
    });

    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {});
    };
  }, [checkWalletConnection]);

  if (!ready) {
    return (
      <div className="opacity-0 pointer-events-none user-select-none" aria-hidden="true">
        Loading...
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      if (authenticated) {
        await connectWallet();
      } else {
        await login();
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect using Privy
      await logout();
      
      // Disconnect using wagmi
      wagmiDisconnect();
      
      // Update local state
      setIsWalletConnected(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  if (!isWalletConnected) {
    return (
      <button
        onClick={handleConnect}
        type="button"
        className="bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md"
      >
        Connect Wallet
      </button>
    );
  }

  const mainWallet = user?.linkedAccounts?.find(account => account.type === 'wallet');

  return (
    <div style={{ display: "flex", gap: 12 }}>
      <button
        onClick={handleDisconnect}
        type="button"
        className="bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md"
      >
        {mainWallet ? `${mainWallet.address.slice(0, 6)}...${mainWallet.address.slice(-4)}` : 'Disconnect'}
      </button>
    </div>
  );
};