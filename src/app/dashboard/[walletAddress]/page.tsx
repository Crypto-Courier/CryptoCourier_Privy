"use client";
import react, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../styles/History.css";
import NewNavbar from "./newNavbar";
import Footer from "../../../components/Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ChevronDown, LogOut, ExternalLink } from "lucide-react";
import trx from "../../../assets/trx.png";
import { sendEmail } from "../../../components/Email/Emailer";
import { renderEmailToString } from "../../../components/Email/renderEmailToString";
import { usePrivy, useLogout, PrivyProvider } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { Transaction } from "../../../types/types";
import { useWallet } from "../../../context/WalletContext";

const WalletAddressPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { walletData } = useWallet();
  const { ready, authenticated, user, exportWallet } = usePrivy();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
      toast.success("Logged out successfully");
    },
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isWalletReady, setIsWalletReady] = useState(false);
  const { theme } = useTheme();
  const walletAddress = params?.walletAddress as string;

  useEffect(() => {
    let mounted = true;

    const initializeWallet = async () => {
      // Wait for Privy to be ready and user to be authenticated
      if (ready && authenticated && user) {
        // Add a small delay to ensure wallet state is properly initialized
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

  const signOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

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

  // useEffect(() => {
  //   if (!user || user.wallet?.address !== walletAddress) {
  //     router.push('/');
  //   }
  // }, [user, walletAddress, router]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/get-dashboard-transaction?walletAddress=${walletAddress}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data: Transaction[] = await response.json();
        setTransactions(data);
      } catch (err: any) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  const handleResend = async (tx: Transaction) => {
    try {
      const subject =
        "Nothing to worry! Your Crypto token is in your inbox again 📩";
      const htmlContent = renderEmailToString({
        recipientEmail: tx.recipientEmail,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
      });

      await sendEmail({
        recipientEmail: tx.recipientEmail,
        subject,
        htmlContent,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
      });

      alert("Email resent successfully!");
    } catch (error) {
      console.error("Error resending email:", error);
      alert("Failed to resend email. Please try again.");
    }
  };

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between items-center bg-opacity-50 p-3 rounded-xl border border-gray-300"
        >
          <div className="flex items-center space-x-3">
            <div className="h-8 w-24 bg-gray-300 rounded-[10px]"></div>
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-8 w-32 bg-gray-300 rounded-[10px]"></div>
          </div>
          <div className="h-8 w-24 bg-gray-300 rounded-full"></div>
        </div>
      ))}
    </div>
  );

  const invite = async () => {
    router.push("/");
  };

  const leaderboard = async () => {
    router.push("/leaderboard");
  };

  const handleMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  // const toggleHelp = () => {
  //   setShowHelp(!showHelp);
  // };

  // Close the help popup if clicking outside of it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setShowHelp(false); // Close the popup
      }
    }
    if (showHelp) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showHelp]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="main">
      <NewNavbar />
      <div className="txbg ">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px]">
          <div
            className={`flex justify-between border-black border-b-0 p-[30px] ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center`}
          >
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
                  {walletAddress
                    ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(
                        -4
                      )}`
                    : "Connect Wallet"}
                  {/* <div> ({bttBalance} BTT)</div> */}
                </span>
                <ChevronDown size={20} />
              </div>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 w-full rounded-md shadow-lg z-10">
                  <div
                    className={` mt-1  rounded-md ${
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
                          className=" rounded-md flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 hover:text-gray-900"
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

            <div className="text-right flex items-end">
              <div className="gap-4 flex">
                {" "}
                <button
                  onClick={leaderboard}
                  className={`px-[30px] py-[10px] rounded-full  hover:scale-110 duration-500 transition 0.3 ${
                    theme === "dark"
                      ? "bg-[#FFE500] text-[#363535]"
                      : "bg-[#E265FF] text-white"
                  }`}
                >
                  Leaderboard
                </button>
                <button
                  onClick={invite}
                  className={`invite px-[30px] py-[10px] rounded-full hover:scale-110 duration-500 transition 0.3 ${
                    theme === "dark"
                      ? "bg-[#FFE500] text-[#363535]"
                      : "bg-[#E265FF] text-white"
                  }`}
                >
                  Invite Your Friends
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start py-[30px] px-[30px]`}
          >
            <div className="space-y-3">
              <h3
                className={`font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] ${
                  theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
              >
                Transaction history
              </h3>
              <div className="h-[40vh] overflow-y-auto scroll">
                {isLoading ? (
                  <SkeletonLoader />
                ) : error ? (
                  <div className="text-red-700 h-[40vh] flex justify-center items-center text-[20px]">
                    {error}
                  </div>
                ) : transactions.length === 0 ? (
                  <p>No transactions found.</p>
                ) : (
                  transactions.map((tx, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center bg-opacity-50 p-3 rounded-xl mt-2 mx-3 ${
                        theme === "dark"
                          ? "bg-[#000000]/20 border border-[#5C5C5C]"
                          : "bg-[#FFFCFC]/20 border border-[#FFFFFF]"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span
                          className={`rounded-[10px] text-[15px]  ${
                            theme === "dark"
                              ? "border border-[#FE660A] text-[#FE660A] bg-[#181818] py-1 px-2"
                              : "border border-[#FE660A] text-[#FE660A] bg-white py-1 px-2"
                          }`}
                        >
                          {tx.tokenAmount} {tx.tokenSymbol}
                        </span>
                        {tx.senderWallet === walletAddress ? (
                          <>
                            <span className="text-[15px] ">to</span>
                            <span
                              className={`rounded-[10px] text-[15px] ${
                                theme === "dark"
                                  ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                                  : "border border-[#0052FF] text-[#0052FF] bg-white py-1 px-2"
                              }`}
                            >
                              {tx.recipientEmail}
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-[15px] ">from</span>
                            <span
                              className={`rounded-[10px] text-[15px] ${
                                theme === "dark"
                                  ? "border border-[#E265FF] text-[#E265FF] bg-[#181818] py-1 px-2"
                                  : "border border-[#0052FF] text-[#0052FF] bg-white py-1 px-2"
                              }`}
                            >
                              {`${tx.senderWallet.slice(
                                0,
                                15
                              )}...${tx.senderWallet.slice(-4)}`}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex gap-3">
                        {tx.senderWallet === walletAddress && (
                          <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                            <button
                              onClick={() => handleResend(tx)}
                              className=""
                            >
                              Resend
                            </button>
                          </div>
                        )}
                        <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                          <Image src={trx} alt="" />
                          <button
                            onClick={() =>
                              openTransactionReciept(tx.customizedLink)
                            }
                          >
                            View Tx
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
// const PrivyWrapper: React.FC = () => {
//   const { theme } = useTheme();
//   return (
//     <PrivyProvider
//       appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
//       config={{
//         loginMethods: ["email"],
//         appearance: {
//           theme: theme === "dark" ? "dark" : "light",
//           accentColor: theme === "dark" ? "#FFE500" : "#E265FF",
//         },
//       }}
//     >
//       <WalletAddressPage />
//     </PrivyProvider>
//   );
// };

export default WalletAddressPage;
