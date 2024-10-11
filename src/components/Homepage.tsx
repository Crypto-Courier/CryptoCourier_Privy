"use client";
import { useTheme } from "next-themes";
import React, { useState, useRef, useEffect } from "react";
import send2 from "../assets/Tcircle2.png";
import { useRouter } from "next/navigation";
import Image from "next/image";
import TokenCircles from "../assets/token.png";
import send from "../assets/send.png";
import "../styles/homepage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useAccount } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { X } from "lucide-react"; // You can replace this with an actual icon library

function Homepage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isConnected, address: walletAddress } = useAccount();
  const { user, login, authenticated } = usePrivy();
  const [showHelp, setShowHelp] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const helpRef = useRef<HTMLDivElement | null>(null); // Define the type for the ref

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

  const OpenHistory = () => {
    if (isConnected || authenticated) {
      router.push("/transaction-history");
    } else {
      alert("Please connect with Wallet first to send tokens.");
    }
  };

  const getActiveAddress = () => {
    if (authenticated && user?.email) {
      return user.email.address;
    } else if (isConnected && walletAddress) {
      return walletAddress;
    }
    return null;
  };

  const activeAddress = getActiveAddress();

  return (
    <div className="main min-h-screen flex flex-col ">
      <Navbar />
      <div className="flex-grow flex flex-col justify-between ">
        <div
          className={`border-y w-full flex justify-center items-center ${
            theme === "light" ? "border-[#1E1E1E]" : "border-white"
          }`}
        >
          <div className="flex lg:flex-row md:flex-row items-center justify-between w-[90%] mx-auto flex-col lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh]">
            <div
              className={`sec1 lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh] flex items-center text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-[600] lg:border-r-2 lg:rounded-r-[100px] md:border-r-2 md:rounded-r-[100px] md:pr-8 pb-0 md:pb-0 w-full md:w-[60%] lg:w-[60%] text-center md:text-left lg:justify-start md:justify-start font-[700] sm:justify-center justify-center ${
                theme === "light" ? "border-[#1E1E1E]" : "border-white"
              }`}
            >
              Send your tokens
            </div>
            <div className="mt-4 md:mt-0 h-[20vh] w-full md:w-auto hidden justify-center sm:hidden lg:flex md:flex">
              <Image
                src={TokenCircles}
                alt="Token circles"
                className="w-auto py-5"
              />
            </div>
          </div>
        </div>

        <div className="py-10 lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[30vh] w-[90%] mx-auto flex justify-center">
          <div className="sec2 font-[700] flex flex-col sm:flex-row items-center justify-center text-3xl sm:text-3xl md:text-4xl lg:text-6xl w-full mx-auto text-center space-y-4 sm:space-y-0 sm:space-x-4 font-[600]">
            <div>CryptoCourier</div>
            <div>
              {theme === "light" ? (
                <Image
                  src={send2}
                  alt="send email"
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-full inline-flex h-auto"
                />
              ) : (
                <Image
                  src={send}
                  alt="send email"
                  className="w-12 sm:w-16 md:w-20 lg:w-24 h-full inline-flex h-auto"
                />
              )}
            </div>
            <div>Email to anyone</div>
          </div>
        </div>
        
        {/* {activeAddress && (
          <div className="text-center mb-4">
            <p>Connected as: {activeAddress}</p>
          </div>
        )} */}

        <div className="sec3Bg relative lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh] flex-grow flex items-center">
          <div className="s3div lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh]">
            <div className="s3subdiv flex justify-center">
               {activeAddress ? (
                <button
                  className="hover:scale-110 duration-500 transition 0.3 send px-0 py-0 text-base sm:text-lg md:text-xl lg:text-2xl rounded-full relative w-[50%] sm:w-[50%] md:w-[40%] lg:w-[25%] max-w-[300px] bg-[#FFFFFF]/25"
                  onClick={OpenHistory}
                >
                  Send
                </button>
              ) : (
                <button
                  className="hover:scale-110 duration-500 transition 0.3 send px-0 py-0 text-base sm:text-lg md:text-xl lg:text-2xl rounded-full relative w-[50%] sm:w-[50%] md:w-[40%] lg:w-[25%] max-w-[300px] bg-[#FFFFFF]/25"
                  onClick={() => login()}
                >
                  Connect or Login
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <button
        className={`showhelp fixed bottom-4 right-4 bg-[#FF3333] text-white font-bold w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-2xl z-50 ${
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
    </div>
  );
}

export default Homepage;
