import React, { useEffect, useState, useCallback, useRef } from "react";
import { usePrivy, useLogout, getAccessToken } from "@privy-io/react-auth";
import {
  useDisconnect,
  useAccount,
  useChainId,
  useSwitchChain,
  useBalance,
} from "wagmi";
import { ChevronDown } from "lucide-react";
import { useWallet } from '../context/WalletContext';

export const Connect = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { chains, switchChain } = useSwitchChain();
  const currentChain = chains.find((chain) => chain.id === chainId);
  const { setWalletData } = useWallet();

  const { login, authenticated, ready, user, connectWallet } = usePrivy();

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

  const handleChangeWallet = useCallback(async () => {
    try {
      // Step 2: Connect a new wallet
      await connectWallet(); // This will prompt the user to connect a new wallet
    } catch (error) {
      console.error("Failed to change wallet:", error);
    }
  }, [logout, wagmiDisconnect, connectWallet]);

  const checkWalletConnection = useCallback(() => {
    if (authenticated && user) {
      const connectedWallets =
        user.linkedAccounts?.filter((account) => account.type === "wallet") ||
        [];
      setIsWalletConnected(connectedWallets.length > 0);
    } else {
      setIsWalletConnected(false);
    }
  }, [authenticated, user]);
  
  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  // useEffect(() => {
  //   if (authenticated && user) {
  //     const connectedWallets =
  //       user.linkedAccounts?.filter((account) => account.type === "wallet") ||
  //       [];
  //     setIsWalletConnected(connectedWallets.length > 0);
      
  //     // Update wallet data in context
  //     setWalletData({
  //       address: address,
  //       chainId: chainId,
  //       authenticated: authenticated,
  //       user: user,
  //       balance: balance
  //     });
  //   } else {
  //     setIsWalletConnected(false);
  //     setWalletData(null);
  //   }
  // }, [authenticated, user, address, chainId, setWalletData]);

  useEffect(() => {
    if (authenticated && user) {
      const connectedWallets =
        user.linkedAccounts?.filter((account) => account.type === "wallet") ||
        [];
      setIsWalletConnected(connectedWallets.length > 0);
      
      // Fetch Privy chain ID
      const fetchPrivyChainId = async () => {
        try {
          const token = await getAccessToken();
          const response = await fetch('https://auth.privy.io/api/v1/chain_id', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          return data.chainId;
        } catch (error) {
          console.error("Failed to fetch Privy chain ID:", error);
          return null;
        }
      };

      // Update wallet data in context
      const updateWalletData = async () => {
        const privyChainId = await fetchPrivyChainId();
        setWalletData({
          address: address,
          chainId: privyChainId || chainId,
          authenticated: authenticated,
          user: user,
          balance: balance
        });
      };

      updateWalletData();
    } else {
      setIsWalletConnected(false);
      setWalletData(null);
    }
  }, [authenticated, user, address, chainId, setWalletData, getAccessToken]);

  useEffect(() => {
    // Listen for external wallet disconnection
    window.ethereum?.on("accountsChanged", (accounts: string | any[]) => {
      if (accounts.length === 0) {
        setIsWalletConnected(false);
      } else {
        checkWalletConnection();
      }
    });

    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (
        chainDropdownRef.current &&
        !chainDropdownRef.current.contains(event.target as Node)
      ) {
        setIsChainDropdownOpen(false);
      }
      if (
        walletDropdownRef.current &&
        !walletDropdownRef.current.contains(event.target as Node)
      ) {
        setIsWalletDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.ethereum?.removeListener("accountsChanged", () => {});
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [checkWalletConnection]);

  const { data: balance } = useBalance({
    address: address as `0x${string}`,
  });

  if (!ready) {
    return (
      <div
        className="opacity-0 pointer-events-none user-select-none"
        aria-hidden="true"
      >
        Loading...
      </div>
    );
  }

  const handleConnect = async () => {
    try {
      await login();
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
    setIsChainDropdownOpen((prev) => !prev);
    setIsWalletDropdownOpen(true);
  };

  const toggleWalletDropdown = () => {
    setIsWalletDropdownOpen((prev) => !prev);
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
        className="border border-[#FFFFFF] w-50 bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
      >
        Connect Wallet
      </button>
    );
  }

  const mainWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  );

  // Filter out the current chain from the list of chains
  const otherChains = chains.filter((chain) => chain.id !== chainId);

  return (
    <div className="flex gap-4">
      <div
        className="relative "
        ref={chainDropdownRef}
        onMouseEnter={() => setIsChainDropdownOpen(true)}
        onMouseLeave={() => setIsChainDropdownOpen(false)}
      >
        <button
          onClick={toggleChainDropdown}
          className="border border-[#FFFFFF] bg-[#FF3333] py-3 px-4 rounded-full lg:w-48 md:w-48 sm:w-48 w-30 font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
        >
          {currentChain && <span className="mr-2">{currentChain.name}</span>}
          {/* <ChevronDown size={16} /> */}
        </button>
        <div className="mt-2">
          {isChainDropdownOpen && (
            <div className="absolute left-0 lg:w-48 md:w-48 sm:w-48 w-30 rounded-[10px] shadow-lg bg-[#131313] ring-1 ring-black ring-opacity-5 flex items-center justify-center border border-[#696969] ">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {chains.map((chain) => (
                  <button
                    key={chain.id}
                    onClick={() => handleSwitchChain(chain.id)}
                    className={`block g:w-40 md:w-40 sm:w-40 w-20 text-center px-3 py-2 text-md rounded-full my-3 ${
                      chainId === chain.id
                        ? "transparent text-[#FF3333] border border-[#FF3333] "
                        : "transparent text-[#FF3333]  border border-[#FF3333] "
                    }`}
                    role="menuitem"
                  >
                    <span>{chain.name}</span>
                    {chainId === chain.id && (
                      <span className="ml-2 bg-pink-500 rounded-full w-2 h-2"></span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div
        className="relative"
        ref={walletDropdownRef}
        onMouseEnter={() => setIsWalletDropdownOpen(true)}
        onMouseLeave={() => setIsWalletDropdownOpen(false)}
      >
        <button
          onClick={toggleWalletDropdown}
          type="button"
          className="border border-[#FFFFFF] lg:w-50 md:w-50 sm:w-50 w-30 bg-[#FF3333] py-3 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
        >
          {mainWallet ? (
            <>
              {mainWallet.address.slice(0, 6)}...{mainWallet.address.slice(-4)}
              <span className="hidden sm:inline-block">
                {/* Balance is shown only on screens medium and above */}(
                {balance?.formatted.slice(0, 4)} {balance?.symbol})
              </span>
            </>
          ) : (
            "Connected"
          )}
          {/* <ChevronDown className="ml-2" size={16} /> */}
        </button>
        <div className="mt-2">
          {isWalletDropdownOpen && (
            <div className=" absolute right-0 w-48 rounded-[10px] shadow-lg bg-[#131313]  ring-1 ring-black ring-opacity-5 flex items-center justify-center flex-col border border-[#696969] py-3">
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleChangeWallet}
                  className="w-40 block text-center px-3 py-2 text-md transparent text-[#FF3333] border border-[#FF3333]  rounded-full"
                  role="menuitem"
                >
                  Change wallet
                </button>
              </div>
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <button
                  onClick={handleDisconnect}
                  className="w-40 block px-3 py-2 text-md transparent text-[#FF3333] border border-[#FF3333]  rounded-full text-center"
                  role="menuitem"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
