import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePrivy, useLogout } from '@privy-io/react-auth';
import { useDisconnect, useAccount, useChainId, useSwitchChain } from 'wagmi';
import { ChevronDown } from 'lucide-react';

export const Connect = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const currentChain = chains.find(chain => chain.id === chainId);

  const { 
    login, 
    authenticated, 
    ready, 
    user,
    connectWallet,
  } = usePrivy();

  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isChainDropdownOpen, setIsChainDropdownOpen] = useState(false);
  const [isWalletDropdownOpen, setIsWalletDropdownOpen] = useState(false);
  const chainDropdownRef = useRef<HTMLDivElement | null>(null);
  const walletDropdownRef = useRef<HTMLDivElement | null>(null);

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
    window.ethereum?.on('accountsChanged', (accounts: string | any[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
      } else {
        checkWalletConnection();
      }
    });

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (chainDropdownRef.current && !chainDropdownRef.current.contains(event.target as Node)) {
        setIsChainDropdownOpen(false);
      }
      if (walletDropdownRef.current && !walletDropdownRef.current.contains(event.target as Node)) {
        setIsWalletDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.ethereum?.removeListener('accountsChanged', () => {});
      document.removeEventListener('mousedown', handleClickOutside);
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
      setIsWalletDropdownOpen(false);
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const toggleChainDropdown = () => {
    setIsChainDropdownOpen(prev => !prev);
    setIsWalletDropdownOpen(false);
  };

  const toggleWalletDropdown = () => {
    setIsWalletDropdownOpen(prev => !prev);
    setIsChainDropdownOpen(false);
  };

  const handleSwitchChain = async (newChainId: number) => {
    try {
      await switchChain({ chainId: newChainId });
      setIsChainDropdownOpen(false);
    } catch (error) {
      console.error("Failed to switch chain:", error);
      // Handle error (e.g., show error message to user)
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

  // Filter out the current chain from the list of chains
  const otherChains = chains.filter(chain => chain.id !== chainId);

  return (
    <div className="flex gap-2">
      <div className="relative" ref={chainDropdownRef} 
        onMouseEnter={() => setIsChainDropdownOpen(true)} 
        onMouseLeave={() => setIsChainDropdownOpen(false)}>
        <button
          onClick={toggleChainDropdown}
          className="bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center"
        >    
          {currentChain && <span className="mr-2">{currentChain.name}</span>}
          <ChevronDown size={16} />
        </button>
        {isChainDropdownOpen && (
          <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              {otherChains.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleSwitchChain(chain.id)}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    chainId === chain.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  role="menuitem"
                >
                  Switch to {chain.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="relative" ref={walletDropdownRef} 
        onMouseEnter={() => setIsWalletDropdownOpen(true)} 
        onMouseLeave={() => setIsWalletDropdownOpen(false)}>
        <button
          onClick={toggleWalletDropdown}
          type="button"
          className="bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center"
        >
          {mainWallet ? `${mainWallet.address.slice(0, 6)}...${mainWallet.address.slice(-4)}` : 'Connected'}
          <ChevronDown className="ml-2" size={16} />
        </button>
        {isWalletDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              <button
                onClick={handleDisconnect}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
