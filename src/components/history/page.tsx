"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  ReadonlyURLSearchParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import "../../styles/History.css";
import Navbar from "../Navbar";
import NewNavbar from "../newNavbar";
import Footer from "../Footer";
import { useTheme } from "next-themes";
import { useWallet } from "../../context/WalletContext";
import TransactionTable from "../TransactionTable";
import toast, { Toaster } from "react-hot-toast";
import { ChevronDown, LogOut, ExternalLink } from "lucide-react";
import { usePrivy, useLogout } from "@privy-io/react-auth";
import Image from "next/image";
import board from "../../assets/leaderboard.png";

const History: React.FC = () => {
  const router = useRouter();
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

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
      toast.success("Logged out successfully");
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

  const renderWalletAddress = () => {
    if (viewMode === "dashboard") {
      return (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          ref={dropdownRef}
        >
          <div
            className={`flex items-center space-x-3 p-2 rounded-[10px] ${
              theme === "dark"
                ? "bg-[#1C1C1C] border border-[#A2A2A2]"
                : "bg-[#F4F3F3] border border-[#C6C6C6]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${
                theme === "dark"
                  ? "border-white bg-transparent"
                  : "border-gray-500 bg-transparent"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
              ></div>
            </div>
            <span className="font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
              {dashboardAddress
                ? `${dashboardAddress.slice(0, 6)}...${dashboardAddress.slice(
                    -4
                  )}`
                : "Connect Wallet"}
            </span>
            <ChevronDown size={20} />
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full rounded-md shadow-lg z-10">
              <div
                className={`mt-1 rounded-md ${
                  theme === "dark"
                    ? "bg-[#1C1C1C] text-white border border-[#A2A2A2]"
                    : "bg-white text-black border border-[#C6C6C6]"
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

    return (
      <div
        className={`hidden lg:flex md:flex sm:hidden items-center space-x-3 p-2 rounded-[10px] ${
          theme === "dark"
            ? "bg-[#1C1C1C] border border-[#A2A2A2]"
            : "bg-[#F4F3F3] border border-[#C6C6C6]"
        }`}
      >
        <div
          className={`hidden lg:flex md:flex sm:hidden w-10 h-10 rounded-full flex items-center justify-center border-2 transition duration-300 hover:scale-110 ${
            theme === "dark"
              ? "border-white bg-transparent"
              : "border-gray-500 bg-transparent"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              theme === "dark"
                ? "bg-[#FFE500] text-[#363535]"
                : "bg-[#E265FF] text-white"
            }`}
          ></div>
        </div>
        <span className="hidden lg:flex md:flex sm:hidden font-semibold px-2 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px]">
          {activeAddress
            ? `${activeAddress.slice(0, 6)}...${activeAddress.slice(-4)}`
            : "Connect or Login"}
        </span>
      </div>
    );
  };

  return (
    <div className="main">
      {viewMode === "dashboard" ? <NewNavbar /> : <Navbar />}
      <div className="txbg">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px]">
          <div
            className={`flex justify-end sm:justify-end md:justify-between lg:justify-between border-black border-b-0 p-[30px] shadow-lg ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center`}
          >
            {renderWalletAddress()}
            <div className="text-right flex items-end">
              <div className="gap-4 flex">
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
            className={`pt-6 pb-6 ${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start`}
          >
            <TransactionTable viewMode={viewMode} />
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
