"use client";
import react, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { useAccount } from "wagmi";
import Image from "next/image";
import trx from "../../assets/trx.png";
import { sendEmail } from "../../components/Email/Emailer";
import { renderEmailToString } from "../../components/Email/renderEmailToString";
import { Transaction } from "../../types/types";
import toast, { Toaster } from "react-hot-toast";
import lLogo from "../../assets/lLogo.png";
import dLogo from "../../assets/dLogo.png";
import { X } from "lucide-react"; // You can replace this with an actual icon library
import loader from "../../assets/loading.gif";
import Joyride from "react-joyride";

const TxHistory: React.FC = () => {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null);
  const [loadingTxId, setLoadingTxId] = useState<number | null>(null);
  const [runTour2, setRunTour2] = useState(false); // Initially set to false
  const [pageLoaded, setPageLoaded] = useState(false);

  const { theme } = useTheme();

  const steps = [
    {
      target: ".resend",
      disableBeacon: true,
      content: "Click here to resend email to receiver",
    },
    {
      target: ".trx",
      disableBeacon: true,
      content: "Click here to show transaction data in block explorer.",
    },
    {
      target: ".showhelp",
      disableBeacon: true,
      content: "Need help? Click here for assistance.",
    },
  ];

  // Check if the tour has been completed previously
  useEffect(() => {
    const tourCompleted = localStorage.getItem("tourCompleted2");
    if (!tourCompleted && pageLoaded) {
      setRunTour2(true);
    }
  }, [pageLoaded]);

  // Handle the completion of the tour
  const handleTourCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses = ["finished", "skipped"];
    if (finishedStatuses.includes(status)) {
      localStorage.setItem("tourCompleted2", "true");
      setRunTour2(false);
    }
  };
  // Condition routing to send token page
  const SendToken = () => {
    if (isConnected) {
      router.push("/send-token");
    } else {
      alert(
        "It seems you are disconnected from your wallet. Please connect your wallet to send token."
      );
    }
  };

  useEffect(() => {
    if (!isLoading && (transactions.length > 0 || error)) {
      setPageLoaded(true);
    }
  }, [isLoading, transactions, error]);

  // useEffect to fetch the transaction detail from database
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!address) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/get-transactions?walletAddress=${address}`
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
  }, [address]);

  const openTransactionReciept = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  // Resend email
  const handleResend = async (tx: Transaction, index: number) => {
    setLoadingTxId(index);
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
      toast.success("Email resent successfully!");
    } catch (error) {
      console.error("Error resending email:", error);
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setLoadingTxId(null); // Reset the loading state once done
    }
  };

  // Skeleton Laoding
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

  return (
    <div className="main">
      <Navbar />

      <div className="txbg ">
        <div className="max-w-6xl w-[90%] mx-auto my-[60px] ">
          <div
            className={`flex justify-between border-black border-b-0 p-[30px] shadow-lg ${
              theme === "dark" ? "bg-black" : "bg-white"
            } rounded-tl-[40px] rounded-tr-[40px] items-center }`}
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
                {address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : "Connect Wallet"}
              </span>
            </div>
            <div className="text-right flex items-end">
              <div></div>
              <button
                className={`px-[30px] py-[10px] rounded-full lg:mx-7 md:mx-7 sm:mx-7 hover:scale-110 duration-500 transition 0.3 mx-0 text-[12px] lg:text-[15px] md:text-[15px] sm:text-[15px] ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#E265FF] text-white"
                }`}
                onClick={SendToken}
              >
                GIFT TOKEN
              </button>
            </div>
          </div>

          <div
            className={`  ${
              theme === "dark"
                ? "bg-[#0A0A0A]/80 backdrop-blur-[80px]"
                : "bg-white/80 backdrop-blur-[80px]"
            } rounded-br-[40px] rounded-bl-[40px] md:flex-row space-y-6 md:space-y-0 md:space-x-6 lg:py-[30px] lg:px-[30px] md:py-[50px] md:px-[30px] sm:py-[50px] sm:px-[30px] justify-between items-start py-[30px] px-[30px]`}
          >
            <div className="space-y-3 text-[12px] lg:text-[13px] md:text-[13px] sm:text-[13px]">
              <h3
                className={` font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] ${
                  theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                }`}
              >
                Transaction history
              </h3>
              <div className="h-[40vh] overflow-y-auto scroll">
                {isConnected ? (
                  isLoading ? (
                    <SkeletonLoader />
                  ) : error ? (
                    <div className="text-red-700 h-[40vh] flex justify-center items-center text-[20px]">
                      No transactions found for your wallet address.
                    </div>
                  ) : transactions.length === 0 ? (
                    <p>No transactions found for your wallet address.</p>
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
                            className={`rounded-[10px] text-[15px] ${
                              theme === "dark"
                                ? "border border-[#FE660A] text-[#FE660A] bg-[#181818] py-1 px-2"
                                : "border border-[#FE660A] text-[#FE660A] bg-white py-1 px-2"
                            }`}
                          >
                            {tx.tokenAmount} {tx.tokenSymbol}
                          </span>
                          {tx.senderWallet === address ? (
                            <>
                              <span className="text-[15px]">to</span>
                              <span
                                className={`rounded-[10px]text-[15px] ${
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
                              <span className="text-[15px]">from</span>
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
                          {tx.senderWallet === address && (
                            <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex items-center gap-2">
                              {loadingTxId === index ? (
                                <Image
                                  src={loader}
                                  alt="Loading..."
                                  className="w-6 h-6"
                                />
                              ) : (
                                <button
                                  onClick={() => handleResend(tx, index)} // Pass the index to identify transaction
                                  className="resend text-[15px] "
                                >
                                  Resend
                                </button>
                              )}
                            </div>
                          )}
                          <div className="bg-[#FF336A] hover:scale-110 duration-500 transition 0.3 text-white px-5 py-2 rounded-full text-[12px] flex item-center gap-2">
                            <Image src={trx} alt="" />
                            <button
                              className="trx text-[15px] "
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
                  )
                ) : (
                  <div
                    className={`text-center font-medium text-[17px] lg:text-[20px] md:text-[20px] sm:text-[20px] ${
                      theme === "dark" ? "text-[#DEDEDE]" : "text-[#696969]"
                    }`}
                  >
                    Connect your wallet to view your transactions.
                  </div>
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
                using just their email address, even if they are new to crypto.
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
                  Each transaction comes with a "View Tx" button. When you click
                  it, you’ll be taken to a block explorer for Txn details.
                </li>
                <li>
                  If you sent tokens to someone and they didn’t receive the
                  email or accidentally deleted it, don't worry! You can click
                  on the "Resend" button to send the claim token email again, so
                  they can still receive their tokens.
                </li>
                <li>
                  Not able to see any transaction details? Just invite or send
                  token to other.
                </li>
              </ul>
              <p>
                <strong>What is a Transaction?</strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>
                  {" "}
                  A transaction in crypto is when you send tokens from your
                  wallet to someone else.{" "}
                </li>
                <li>
                  {" "}
                  In the traditional banking world, it’s similar to sending
                  money to another bank account.{" "}
                </li>
                <li>
                  {" "}
                  In the world of blockchain, transactions are recorded on a
                  decentralized system, which means no one controls the data,
                  and everything is secure and transparent.{" "}
                </li>
              </ul>
              <p>
                <strong>What’s a Block Explorer?</strong>
              </p>
              <p>
                A block explorer is like a public search engine for the
                blockchain. It allows you to track your transactions by showing
                details like
                <ul className="list-disc list-inside mt-2 mb-4 ">
                  <li> Time when it was confirmed </li>
                  <li> Amount sent </li>
                  <li> Sender and receiver wallet address </li>
                  <li> Fees that sender paid for confirm transaction </li>
                </ul>
                This gives you full transparency and peace of mind, knowing that
                your tokens are safely transferred.
              </p>
            </div>
          </div>
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      {/* Joyride for the tour */}
      <Joyride
        steps={steps}
        run={runTour2 && pageLoaded}// Only run if tour is not completed
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
export default TxHistory;
