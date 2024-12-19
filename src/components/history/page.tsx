"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import "../../styles/History.css";
import { Tooltip } from "antd";
import Navbar from "../Navbar";
import NewNavbar from "../newNavbar";
import Footer from "../Footer";
import { useTheme } from "next-themes";
import { useWallet } from "../../context/WalletContext";
import TransactionTable from "../TransactionTable";
import toast, { Toaster } from "react-hot-toast";
import { Check, LogOut, ExternalLink, Copy } from "lucide-react";
import { usePrivy, useLogout } from "@privy-io/react-auth";
import Image from "next/image";
import board from "../../assets/leaderboard.png";
import SwitchHistory from "../SwitchHistory";

const History: React.FC = () => {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false); // Track copy state
  const searchParams = useSearchParams() as ReadonlyURLSearchParams;
  const { walletData } = useWallet();
  const { theme } = useTheme();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");
  const { ready, authenticated, user, exportWallet } = usePrivy();
  const [isWalletReady, setIsWalletReady] = useState(false);
  const viewMode = searchParams.get("mode") || "default";
  const dashboardAddress = searchParams.get("address");
  const activeAddress =
    viewMode === "dashboard" ? dashboardAddress : walletData?.address;
  const isConnected = walletData?.authenticated;
  const [selectedChains, setSelectedChains] = useState<number[]>([
    8453, 919, 34443, 11155111,
  ]);

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
      toast.success("Logged out successfully");
    },
  });

  const handleCopyWithFeedback = (address: string) => {
    if (address) {
      navigator.clipboard.writeText(address);
      setIsCopied(true); // Show check icon
      toast.success("Address copied to clipboard!");
    } else {
      toast.error("No address available to copy.");
    }

    // Reset back to copy icon after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };

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

  const isAuthenticated = ready && authenticated;
  const hasEmbeddedWallet = user?.linkedAccounts?.find(
    (account) => account.type === "wallet" && account.walletClient === "privy"
  );

  const canExportWallet = isAuthenticated && hasEmbeddedWallet && isWalletReady;

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

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Condition routing to send token page
  const SendToken = () => {
    if (isConnected) {
      router.push("/send-token");
    } else {
      alert(
        "Please connect your wallet or log in to gift tokens to your friend."
      );
    }
  };

  const leaderboard = () => {
    router.push("/leaderboard");
  };

  const invite = () => {
    router.push("/");
  };

  const handleChainSelect = (chains: number[]) => {
    const newSelectedChains =
      chains.length > 0 ? chains : [8453, 919, 34443, 11155111];
    setSelectedChains(newSelectedChains);
  };

  const renderWalletAddress = () => {
    if (viewMode === "dashboard") {
      return (
        <div
          className="relative w-full lg:w-[30%] md:w-[30%]"
          ref={dropdownRef}
        >
          <div
            className={`flex items-center space-x-3 p-3 rounded-[10px] flex-row justify-between mb-3 sm:mb-3 md:mb-0 lg:mb-0 cursor-pointer ${
              theme === "dark"
                ? "bg-[#000000]/40 border lg:border-[#ddcb2cb2]"
                : "bg-[#F4F3F3] border border-[#000000]"
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown on click
          >
            <div
              className="font-semibold px-2 text-[13px] lg:text-[15px] md:text-[15px] sm:text-[13px]"
              onClick={(e) => {
                e.stopPropagation(); // Prevent dropdown toggle when copying
                handleCopy(dashboardAddress || "");
              }}
            >
              {dashboardAddress
                ? `${dashboardAddress.slice(0, 6)}...${dashboardAddress.slice(
                    -4
                  )}`
                : "Connect Wallet"}
            </div>
            {/* Copy or Check Icon */}
            {isCopied ? (
              <Check
                size={20}
                className={`cursor-pointer ${
                  theme === "dark" ? "text-[#ddcb2cb2]" : " text-[#E265FF]"
                }`}
              />
            ) : (
              <Copy
                size={20}
                className={`cursor-pointer ${
                  theme === "dark" ? "text-[#ddcb2cb2]" : " text-[#E265FF]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopyWithFeedback(dashboardAddress || "");
                }}
              />
            )}
          </div>

          {/* Dropdown content */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full rounded-md shadow-lg z-10">
              <div
                className={`mt-1 rounded-md ${
                  theme === "dark"
                    ? "bg-[#1C1C1C] text-white border border-[#A2A2A2]"
                    : "bg-white text-black border border-[#1C1C1C]"
                }`}
              >
                <div className="p-2">
                  <button
                    onClick={handleExportWallet}
                    className={`Export flex items-center w-full px-4 py-2 text-sm rounded-md ${
                      canExportWallet
                        ? "hover:bg-gray-100 hover:text-gray-900"
                        : "opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Export Wallet
                  </button>
                  <div className="logout">
                    <button
                      onClick={signOut}
                      className="rounded-md flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default View
    return (
      <div
        className={`hidden lg:flex md:flex sm:hidden items-center space-x-3 p-2 rounded-[10px] ${
          theme === "dark"
            ? "bg-[#000000]/40 border lg:border-[#ddcb2cb2]"
            : "bg-[#F4F3F3] border border-[#000000]"
        }`}
      >
        <span
          // onClick={() => handleCopy(activeAddress || "")}
          className="cursor-pointer hidden lg:flex md:flex sm:hidden font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]"
        >
          {activeAddress
            ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
            : "Connect or Login"}
        </span>
      </div>
    );
  };
  const handleCopy = (address: string) => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    } else {
      toast.error("No address available to copy.");
    }
  };

  return (
    <div className="main">
      {viewMode === "dashboard" ? <NewNavbar /> : <Navbar />}
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px]">
          <div
            className={`p-0 flex flex-col-reverse sm:flex-col-reverse md:flex-row lg:flex-row justify-end sm:justify-between md:justify-between lg:justify-between border-black border-b-0 lg:p-[30px] shadow-lg md:p-[30px] sm:p-0 ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center`}
          >
            {renderWalletAddress()}
            <div className="text-right flex justify-end  p-[30px] sm:p-[30px] lg:p-0 md:p-0 ">
              <div className="gap-4 flex">
                <Tooltip title="Leaderboard">
                  <button
                    onClick={leaderboard}
                    className={`lg:px-[20px] lg:py-[10px] md:px-[20px] md:py-[10px] px-[20px] py-[10px] rounded-full hover:scale-110 duration-500 transition 0.3 sm:text-[10px] text-[10px] md:text-[15px] lg:text-[15px] ${
                      theme === "dark"
                        ? " text-[#363535] border border-[#FFE500] "
                        : "bg-[#E265FF] text-white"
                    }`}
                  >
                    <Image src={board} width={20} alt="" />
                  </button>
                </Tooltip>
                {viewMode === "default" && (
                  <button
                    className={`px-[30px] py-[10px] rounded-full lg:mx-5 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                      theme === "dark"
                        ? "bg-[#FFE500] text-[#363535]"
                        : "bg-[#E265FF] text-white"
                    }`}
                    onClick={SendToken}
                  >
                    Gift Token
                  </button>
                )}
                {viewMode === "dashboard" && (
                  <button
                    className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                      theme === "dark"
                        ? "bg-[#FFE500] text-[#363535]"
                        : "bg-[#E265FF] text-white"
                    }`}
                    onClick={invite}
                  >
                    Invite Your Friends
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px]`}
          >
            <div className="">
              <SwitchHistory onChainSelect={handleChainSelect} />
            </div>

            <div
              className={` pt-6 pb-6 rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start`}
            >
              <TransactionTable
                viewMode={viewMode}
                selectedChains={selectedChains}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <Toaster
        toastOptions={{
          style: {
            border: "1px solid transparent",
            borderImageSlice: 1,
            background: theme === "dark" ? "white" : "white",
            color: theme === "dark" ? "black" : "black",
          },
        }}
      />
    </div>
  );
};

export default History;
