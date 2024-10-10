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
import lLogo from "../assets/lLogo.png";
import dLogo from "../assets/dLogo.png";
import { X } from "lucide-react"; // You can replace this with an actual icon library

function Homepage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { isConnected } = useAccount();
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
    if (isConnected) {
      router.push("/transaction-history");
    } else {
      alert("Please connect with Wallet first to send tokens.");
    }
  };

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

        <div className="sec3Bg relative lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh] flex-grow flex items-center">
          <div className="s3div lg:h-[20vh] md:h-[20vh] sm:h-[17vh] h-[15vh]">
            <div className="s3subdiv flex justify-center">
              <button
                className="hover:scale-110 duration-500 transition 0.3 send px-0 py-0 text-base sm:text-lg md:text-xl lg:text-2xl rounded-full  relative w-[50%] sm:w-[50%] md:w-[40%] lg:w-[25%] max-w-[300px] bg-[#FFFFFF]/25"
                onClick={OpenHistory}
              >
                Send
              </button>
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
                <strong>Connect Wallet:</strong>
              </p>
              <ul className="list-disc list-inside mt-2 mb-4 ">
                <li>Connect your wallet by click on connect button.</li>
                <li>Select your preferred wallet to get started.</li>
                <li>Select your preferred account to send token.</li>
                <li>Click on confirm to connect wallet.</li>
                <li>Click on send button to move forward.</li>
              </ul>
              <p className="mb-2 mt-2">
                <strong>What is a Wallet?</strong>
              </p>
              <p>
                A crypto wallet is a digital tool that allows you to store,
                send, and receive tokens or cryptocurrencies. It’s similar to a
                physical wallet, but instead of holding cash, it holds your
                digital assets securely.
              </p>
              <p className="mt-2 mb-2">
                <strong>Why to connect wallet?</strong>
              </p>
              <p>
                Connecting your wallet allows you to send tokens easily and
                securely, just like sending an email. By linking your wallet,
                you ensure that only you have access to your funds, making your
                transactions safe and hassle-free.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
