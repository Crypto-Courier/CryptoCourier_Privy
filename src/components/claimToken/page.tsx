"use client";
import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useTheme } from "next-themes";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter, useSearchParams } from "next/navigation";
import spin from "../../assets/spinner.gif";
import Image from "next/image";
import { Wallet } from "ethers";

function ClaimToken() {
  const { theme } = useTheme();
  const { login, authenticated, ready, user, getAccessToken } = usePrivy();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip visibility state

  const transactionHash = searchParams?.get("transactionHash");
  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // Restore scroll when unmounted
    };
  }, []);
  
  useEffect(() => {
    if (ready) {
      setIsAuthenticated(authenticated);
    }
  }, [ready, authenticated]);
  
  useEffect(() => {
    const handleAuthenticationAndRedirect = async () => {
      const token = await getAccessToken();

      if (ready && authenticated && user?.wallet?.address && !isRedirecting) {
        setIsRedirecting(true);
        // Add a small delay to ensure wallet state is properly initialized
        await new Promise((resolve) => setTimeout(resolve, 500));

        try {
          const transactionUpdateResponse = await fetch("/api/update-transaction", {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              transactionHash: transactionHash,
            }),
          });

          // Check if the transaction update response is successful
          if (!transactionUpdateResponse.ok) {
            const errorData = await transactionUpdateResponse.json();
            throw new Error(errorData.message || 'Transaction update failed');
          }

          const userDataResponse = await fetch("/api/user-data", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              transactionHash: transactionHash,
            }),
          });

          // Check if the response is successful
          if (!userDataResponse.ok) {
            const errorData = await userDataResponse.json();
            throw new Error(errorData.error || 'Authentication failed');
          }
        } catch (error) {
          setIsRedirecting(false);
          console.error("Error updating/storing authentication data:", error);
        }

        router.push(`/history?mode=dashboard&address=${user.wallet.address}`);
      }
    };
    handleAuthenticationAndRedirect();
  }, [ready, authenticated, user, router, isRedirecting, transactionHash]);

  const handleClaim = async () => {
    if (!authenticated) {
      try {
        login();
      } catch (error) {
        console.error("Login failed:", error);
        setIsRedirecting(false);
      }
    }
  };

  if (!ready) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <Image src={spin} alt="Loading..." width={100} />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="txbgg flex justify-center items-center ">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-[10px] max-w-[40rem] w-full mx-3 relative ${theme === "dark"
              ? "bg-[#000000] border-red-500 border backdrop-blur-[10px]"
              : "bg-[#FFFCFC] border border-[#FE005B]/60"
              }`}
          >
            <div
              className={`flex justify-center items-center p-6 rounded-tr-[10px] rounded-tl-[10px] ${theme === "dark"
                ? "bg-[#171717] border-b-2 border-red-500"
                : "bg-white border-b-2 border-[#FE005B]"
                }`}
            >
              <div className="flex items-center flex-col">
                <h2
                  className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-black"
                    }`}
                >
                  Sign-UP to Claim Tokens
                </h2>
              </div>
            </div>

            <div className="px-6 py-[3rem]">
              <h3
                className={`text-[12px] lg:text-[18px] md:text-[18px]  sm:text-[15px] mb-4 text-center font-semibold ${theme === "dark" ? "text-white" : "text-black"
                  }`}
              >
                Your crypto adventure begins here.😍
              </h3>

              <button
                onClick={handleClaim}
                className={`${theme === "dark" ? "bg-[#FF336A]" : "bg-[#0052FF]"
                  } login w-[50%] text-white py-2 rounded-[10px] flex items-center justify-center mb-6 mx-auto relative text-[12px] lg:text-[18px] md:text-[18px]  sm:text-[15px]`}
              // onMouseEnter={() => setShowTooltip(true)} // Show tooltip on hover
              // onMouseLeave={() => setShowTooltip(false)} // Hide tooltip when not hovering
              >
                {isAuthenticated ? `Go to Dashboard` : `Login to Claim Tokens`}
              </button>
              {/* {showTooltip && (
                <div
                  className={`z-50 absolute top-[70px] left-1/2  border border-red-300 rounded-lg p-3 w-[50%] m-auto  ${
                    theme === "dark"
                      ? "bg-[#000000]  text-white text-sm"
                      : "bg-[#FFFFFF]  text-black text-sm z-50"
                  }`}
                >
                  When you click on the Button then you will be authenticated
                  through privy. Make sure to enter the email in which you got
                  tokens.
                </div>
              )} */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ClaimToken;
