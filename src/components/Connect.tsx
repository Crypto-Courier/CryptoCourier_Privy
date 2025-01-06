import React, {
  useEffect,
  useState,
  useCallback,
  useRef,
  isValidElement,
} from "react";
import { usePrivy, useLogout, useWallets } from "@privy-io/react-auth";
import { useTheme } from "next-themes";
import { useWallet } from "../context/WalletContext";
import { Tooltip } from "antd";
import { chainLogos } from "../utils/chainIdToLogo";
import { useRouter } from "next/navigation";
import { Copy, ExternalLink, HelpCircle, LogOutIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import WalletPopup from "./WalletPopup";

const chainNames: { [key: number]: string } = {
  8453: "Base",
  291: "Orderly",
  7560: "Cyber",
  7777777: "Zora",
  42220: "Celo",
  34443: "Mode",
  1135: "Lisk",
  255: "Kroma",
  10: "Optimism",
  252: "Fraxtal",
  11155111: "Ethereum Sepolia",
  480: "World Chain",
  288: "Boba Network",
  185: "Mint",
  690: "Redstone",
  360: "Shape",
  254: "Swan",
  8866: "Superlumio",
  1750: "MetalL2",
  5112: "Ham Chain",
  2192: "Snax Chain",
  888888888: "Ancient 8",
};

export const Connect = () => {
  const { setWalletData, selectedChain, walletData } = useWallet(); // Get selectedChain from context
  const router = useRouter(); // Initialize the router
  const { wallets } = useWallets();
  const wallet = wallets[0];
  const { theme } = useTheme();
  const [isWalletReady, setIsWalletReady] = useState(false);
  const {
    login,
    authenticated,
    ready,
    user,
    connectWallet,
    createWallet,
    exportWallet,
  } = usePrivy();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isEmailConnected, setIsEmailConnected] = useState(false);
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const walletDropdownRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [exportStatus, setExportStatus] = useState<string>("");

  const isAuthenticated = ready && authenticated;
  const hasEmbeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet" && account.walletClient === "privy"
  );

  const canExportWallet = isAuthenticated && hasEmbeddedWallet && isWalletReady;

  const { logout } = useLogout({
    onSuccess: () => {
      setIsWalletConnected(false);
      setIsEmailConnected(false);
      setWalletData(null);
      clearCookiesAndStorage();

      // Redirect to homepage after disconnect
      router.push("/");
    },
  });

  useEffect(() => {
    let mounted = true;

    const initializeWallet = async () => {
      if (ready && authenticated && user) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (mounted) {
          setIsWalletReady(true);
        }
      }
    };

    initializeWallet();

    return () => {
      mounted = false;
    };
  }, [ready, authenticated, user]);

  const checkWalletConnection = useCallback(() => {
    if (authenticated && user) {
      const connectedWallets =
        user.linkedAccounts?.filter((account) => account.type === "wallet") ||
        [];
      setIsWalletConnected(connectedWallets.length > 0);
      setIsEmailConnected(!!user.email?.address);
    } else {
      setIsWalletConnected(false);
      setIsEmailConnected(false);
    }
  }, [authenticated, user, wallet]);

  useEffect(() => {
    const createEmbeddedWallet = async () => {
      if (!ready || !authenticated || isCreatingWallet || !user) return;

      // Check if user logged in with email and doesn't have an embedded wallet
      const hasEmbeddedWallet = wallets.some(
        (wallet) => wallet.walletClientType === "privy"
      );
      const isEmailUser = user.linkedAccounts.some(
        (account) => account.type === "email"
      );

      if (isEmailUser && !hasEmbeddedWallet) {
        try {
          setIsCreatingWallet(true);
          const newWallet = await createWallet();
          console.log("Created new embedded wallet:", newWallet);

          // Update wallet data with the new embedded wallet
          if (newWallet) {
            setWalletData({
              address: newWallet.address,
              chainId: newWallet.chainId,
              authenticated: authenticated,
              user: user,
              isEmailConnected: true,
            });
          }
        } catch (error) {
          console.error("Error creating embedded wallet:", error);
        } finally {
          setIsCreatingWallet(false);
        }
      }
    };

    createEmbeddedWallet();
  }, [
    ready,
    authenticated,
    user,
    wallets,
    createWallet,
    isCreatingWallet,
    setWalletData,
  ]);

  useEffect(() => {
    checkWalletConnection();
  }, [checkWalletConnection]);

  useEffect(() => {
    if (authenticated && user) {
      const updateWalletData = async () => {
        if (wallet) {
          setWalletData({
            address: wallet.address,
            chainId: wallet.chainId,

            authenticated: authenticated,
            user: user,
            isEmailConnected: !!user.email?.address,
          });
        }
      };

      updateWalletData();
      setIsWalletConnected(true);
    } else {
      setIsWalletConnected(false);
      setWalletData(null);
    }
  }, [authenticated, user, setWalletData, wallet]);

  const clearCookiesAndStorage = () => {
    // Clear all cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });

    // Clear sessionStorage and localStorage
    localStorage.clear();
    sessionStorage.clear();
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const clearInitialStorage = () => {
      // Clear all cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
      });

      // Clear sessionStorage and localStorage
      localStorage.clear();
      sessionStorage.clear();

      // Optional: Set a flag in localStorage to indicate initial load is done
      localStorage.setItem("initialLoadCleared", "true");
    };

    // Check if this is the first load
    const isFirstLoad = !localStorage.getItem("initialLoadCleared");

    if (isFirstLoad) {
      clearInitialStorage();
    }
  }, []);

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
  const handleExportWallet = async () => {
    if (!canExportWallet) {
      toast.error("Please wait for wallet initialization to complete");
      return;
    }

    setExportStatus("Exporting wallet...");
    try {
      await exportWallet();
      setExportStatus("Wallet exported successfully");
      toast.success("Wallet exported successfully.");
    } catch (error) {
      console.error("Error exporting wallet:", error);
      let errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setExportStatus(`Export failed: ${errorMessage}`);
      toast.error("Failed to export wallet. Please try again.");
    }
  };

  const handleCopyAddress = async () => {
    if (walletData?.address) {
      await navigator.clipboard.writeText(walletData.address);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const handleConnect = async () => {
    try {
      await login();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  if (!isWalletConnected) {
    return (
      <button
        onClick={handleConnect}
        type="button"
        className="border border-[#FFFFFF] w-50 bg-[#FF3333] py-2 px-4 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center"
      >
        {isCreatingWallet ? "Creating Wallet..." : "Connect Wallet"}
      </button>
    );
  }

  const mainWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet"
  );

  return (
    <div className="flex gap-4">
      <div className="relative" ref={walletDropdownRef}>
        <button
          onMouseEnter={() => setShowDropdown(true)}
          // onMouseLeave={() => setShowDropdown(false)}

          type="button"
          className="border border-[#FFFFFF] lg:w-50 md:w-50 sm:w-50 w-30 bg-[#FF3333] py-2 px-4 md:py-3 sm:py-3 lg:py-3 rounded-full font-bold hover:scale-110 duration-500 transition 0.3 text-[10px] sm:text-sm md:text-md lg:text-md flex items-center justify-center gap-2"
        >
          {/* Chain Image */}
          <Tooltip
            title={
              selectedChain && chainNames[selectedChain]
                ? chainNames[selectedChain]
                : "Chain"
            }
          >
            {selectedChain && chainLogos[selectedChain] ? (
              <img
                src={chainLogos[selectedChain].src} // Use .src if using StaticImageData
                alt={`Chain ${selectedChain}`}
                className={`w-[24px] h-[24px] block my-0 mx-auto p-[1px] rounded-[15px] ${
                  theme === "dark" ? "bg-white" : "bg-black"
                }`}
              />
            ) : (
              selectedChain
            )}
          </Tooltip>

          {/* Wallet Address */}
          {walletData?.address ? (
            <>
              {walletData?.address.slice(0, 6)}...
              {walletData?.address.slice(-4)}
            </>
          ) : (
            "Connected"
          )}
        </button>
      </div>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className=" Export absolute -right-10  mt-2 w-48 bg-white dark:bg-[#0A0A0A]/90 backdrop-blur-[80px] rounded-lg shadow-lg overflow-hidden z-50 top-20"
        >
          <button
            onClick={handleExportWallet}
            className={`Export flex items-center w-full px-4 py-2 text-sm rounded-md ${
              canExportWallet
                ? "hover:bg-gray-100 hover:text-gray-900"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            <ExternalLink
              size={16}
              className="mr-2"
              onClick={() => setIsPopupOpen(true)}
            />
            Export Wallet
            <span
              className="ml-2 cursor-pointer text-gray-500 hover:text-gray-700"
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the export action
                setIsPopupOpen(true); // Toggle the popup state
              }}
            >
              <HelpCircle size={16} />
            </span>
          </button>
          <button
            onClick={handleCopyAddress}
            className=" Export w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white transition-colors dark:hover:text-black duration-150 flex items-center gap-2"
          >
            <Copy size={16} />
            {copySuccess ? "Copied!" : "Copy Address"}
          </button>
          <button
            onClick={logout}
            className=" Export w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-white dark:hover:text-black marker:transition-colors duration-150 flex items-center gap-2"
          >
            <LogOutIcon size={16} />
            Disconnect
          </button>
        </div>
      )}
      {isPopupOpen && (
        <WalletPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};
