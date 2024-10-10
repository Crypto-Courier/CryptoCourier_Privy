"use client";
import react, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import "../../../styles/History.css";
import NewNavbar from "./newNavbar";
import Footer from "../../../components/Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import { ChevronDown, LogOut, ExternalLink } from "lucide-react";
import lLogo from "../../../assets/lLogo.png";
import dLogo from "../../../assets/dLogo.png";
import { X } from "lucide-react"; // You can replace this with an actual icon library
import trx from "../../../assets/trx.png";
import { sendEmail } from "../../../components/Email/Emailer";
import { renderEmailToString } from "../../../components/Email/renderEmailToString";
import { usePrivy, useLogout, PrivyProvider } from "@privy-io/react-auth";
import toast from "react-hot-toast";
import { Transaction } from "../../../types/types";
import Joyride from "react-joyride";

const WalletAddressPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const { ready, authenticated, user, exportWallet } = usePrivy();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string>("");
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref
  const [runTour4, setRunTour4] = useState(false); // Initially set to false

  const { logout } = useLogout({
    onSuccess: () => {
      router.push("/");
      toast.success("Logged out successfully");
    },
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [bttBalance, setBttBalance] = useState<string>("0");
  const [isWalletReady, setIsWalletReady] = useState(false);

  const { theme } = useTheme();

  const walletAddress = params?.walletAddress as string;

  const steps = [
    {
      target: ".Export",
      disableBeacon: true,
      content: "Click here to export your wallet.",
    },
    {
      target: ".logout",
      disableBeacon: true,
      content: "Click here to logout.",
    },
    {
      target: ".invite",
      disableBeacon: true,
      content: "Click here to invite your friends.",
    },
    {
      target: ".showhelp",
      disableBeacon: true,
      content: "Need help? Click here for assistance.",
    },
  ];
  // Check if the tour has been completed previously
  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted4");
    if (!tourCompleted) {
      setRunTour4(true); // Run the tour if it hasn't been completed
    }
  }, []);

  // Handle the completion of the tour
  const handleTourCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("tourCompleted4", "true"); // Set tour as completed
      setRunTour4(false); // Stop running the tour
    }
  };

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

  useEffect(() => {
    if (walletAddress) {
      fetchBTTBalance(walletAddress);
    }
  }, [walletAddress]);

  const fetchBTTBalance = async (address: string) => {
    try {
      const response = await fetch(`/api/getBTTbalance?address=${address}`);
      const data = await response.json();
      if (response.ok) {
        setBttBalance(data.balance);
      } else {
        console.error("Error fetching BTT balance:", data.message);
      }
    } catch (error) {
      console.error("Error fetching BTT balance:", error);
    }
  };

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
          `/api/get-transactions?walletAddress=${walletAddress}`
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

  const toggleHelp = () => {
    setShowHelp(!showHelp);
  };

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
                  <div> ({bttBalance} BTT)</div>
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
              {/* <div>
                <div className="text-[18px] text-black-600 py-1 font-[500] text-start">
                  Your BTT Balance
                </div>
                <div
                  className={`text-[25px] font-bold   py-1 px-3 rounded-[10px] ${
                    theme === "dark"
                      ? "text-[#FFE500] border border-[#A2A2A2] bg-[#1C1C1C]"
                      : "text-[#E265FF] border border-gray"
                  }`}
                ></div>
              </div> */}
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
      <button
        className={`showhelp fixed bottom-4 right-4 bg-[#000000] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 ${
          !showHelp ? "animate-pulse" : ""
        }`}
        onClick={toggleHelp}
        onMouseEnter={() => setTooltipVisible(true)} // Show tooltip on hover
        onMouseLeave={() => setTooltipVisible(false)} // Hide tooltip when not hovering
      >
        {showHelp ? (
          <X className="w-6 h-6" /> // Close icon when popup is open
        ) : (
          "?" // Pulsing Question mark icon when popup is closed
        )}
      </button>
      {/* Tooltip */}
      {tooltipVisible && !showHelp && (
        <div
          className={`absolute bottom-16 right-1 text-sm rounded-lg px-3 py-1 z-50 shadow-lg mb-2 ${
            theme === "dark"
              ? "bg-[#FFFFFF] text-blue-700"
              : "bg-[#1C1C1C] text-[#FFE500]"
          }`}
        >
          Help Center
        </div>
      )}
      {/* Help Popup */}
      {showHelp && (
        <div
          ref={helpRef}
          className={`border border-[#FF3333] fixed  p-6 rounded-lg shadow-lg w-[90%] sm:w-[70%] md:w-[50%] lg:w-[35%] h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[60vh] z-50 overflow-y-auto scroll ${
            theme === "dark" ? "bg-black" : "bg-white"
          }`}
          style={{
            position: "absolute",
            top: "30%", // Slightly adjusted top for better viewing on smaller screens
            right: "10px", // Aligns with the button's right side
          }}
        >
          <div>
            <div
              className="w-[9rem] sm:w-40 md:w-48 lg:w-56 logo"
              style={{ marginLeft: "-17px" }}
            >
              {theme === "light" ? (
                <Image
                  src={dLogo}
                  alt="CRYPTO-COURIER Dark Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto "
                />
              ) : (
                <Image
                  src={lLogo}
                  alt="CRYPTO-COURIER Light Logo"
                  width={400}
                  height={400}
                  className="w-full h-auto "
                />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold mb-4 ">Help Information</h2>
              <p className="">
                CryptoCourier makes it easy for you to send tokens to anyone
                using just their email address, even if they are new to crypto.{" "}
              </p>
              <p className="mt-2">
                <strong> About the Page: </strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>You can view your transactions directly on this page.</li>
                <li>
                  You can see your transaction history for all the transactions
                  you've made using the platform.
                </li>
                <li>
                  If you want control over your wallet then click on address
                  then export wallet. Read below instructions for more.
                </li>
                <li>
                  If you want to invite your friends then click on Invite button
                  but for that export wallet first.
                </li>
                <li>
                  If you want to sign out then click on wallet then sign out
                  button.
                </li>
              </ul>
              <p className="mt-2">
                <strong> What is Exporting Your Wallet? </strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>
                  Exporting your wallet means saving the private keys or
                  recovery phrase associated with your wallet.
                </li>
                <li>This allows you to access your wallet from any device.</li>
                <li>
                  It's important to keep your private keys safe, as anyone with
                  access to them can control your wallet and the assets within
                  it.
                </li>
              </ul>
              <p className="mt-2">
                <strong>To export your wallet:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li> Click on wallet address.</li>
                <li>Find the "Export Wallet" option in dropdown.</li>
                <li>Copy and save your private key or recovery phrase.</li>
                <li>
                  <span className="text-red-400">
                    Make sure to secure your private key or recovery phrase
                    because it is type of password for your wallet but you can't
                    forget or change it.
                  </span>
                </li>
              </ul>
              <p className="mt-2">
                <strong>Download a Wallet:</strong>
              </p>
              <p className="mb-2">
                If you don't have a wallet yet, you can download one from the
                below links:
              </p>
              <ul className="list-disc list-inside mt-2 mb-4">
                <li>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    MetaMask
                  </a>{" "}
                  - Recommanded for New User.
                </li>
                <li>
                  <a
                    href="https://rainbow.me/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Rainbow Wallet
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.coinbase.com/wallet/downloads/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    Coinbase wallet
                  </a>
                </li>
              </ul>
              <p className="mt-2">
                <strong>What is Importing Your Wallet?</strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>
                  Importing your wallet means restoring access to your existing
                  wallet on a new device by using your private key or recovery
                  phrase.
                </li>
                <li>
                  This process is essential when switching devices or recovering
                  access to your wallet.
                </li>
                <li>
                  Importing a wallet ensures you can continue managing your
                  tokens and assets securely.
                </li>
              </ul>
              <p className="mt-2">
                <strong>How to Import Your Wallet:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4">
                <li>Open your wallet application (such as MetaMask).</li>
                <li>Select the "Import Wallet" option from the menu.</li>
                <li>
                  Enter your private key recovery phrase that you saved during
                  the export process.
                </li>
                <li>
                  Confirm the import and access your wallet on the new device.
                </li>
              </ul>

              <p className="mt-2">
                By importing your wallet, you can access your tokens and assets
                from any device, allowing for easy management and secure access.
              </p>
            </div>
          </div>
        </div>
      )}{" "}
      {/* Joyride for the tour */}
      <Joyride
        steps={steps}
        run={runTour4} // Only run if tour is not completed
        continuous
        showSkipButton
        showProgress
        styles={{
          options: {
            zIndex: 1000,
            primaryColor: "#FF3333", // Customize button color to match your theme
          },
          buttonNext: {
            backgroundColor: "#FF3333",
            color: "#fff",
          },
        }}
        locale={{
          next: "Next", // Customize 'Next' button text
          last: "Finish",
        }}
        callback={handleTourCallback} // Handle tour completion
      />
    </div>
  );
};
const PrivyWrapper: React.FC = () => {
  const { theme } = useTheme();
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
      config={{
        loginMethods: ["email"],
        appearance: {
          theme: theme === "dark" ? "dark" : "light",
          accentColor: theme === "dark" ? "#FFE500" : "#E265FF",
        },
      }}
    >
      <WalletAddressPage />
    </PrivyProvider>
  );
};

export default PrivyWrapper;
