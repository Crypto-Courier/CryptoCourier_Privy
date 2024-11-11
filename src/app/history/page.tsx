"use client";
import React from "react";
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../../components/Navbar";
import NewNavbar from "../dashboard/[walletAddress]/newNavbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import { useWallet } from "../../context/WalletContext";
import TransactionTable from "../../components/TransactionTable";
import { Toaster } from "react-hot-toast";

const History: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams() as ReadonlyURLSearchParams;
    const { walletData } = useWallet();
    const { theme } = useTheme();

    const isConnected = walletData?.authenticated;
    const activeAddress = walletData?.address;
    const viewMode = searchParams.get('mode') || 'default'; // 'default' or 'dashboard'

    // Condition routing to send token page
    const SendToken = () => {
        if (isConnected) {
            router.push("/send-token");
        } else {
            alert("Please connect your wallet or log in to gift tokens to your friend.");
        }
    };

    const leaderboard = () => {
        router.push("/leaderboard");
    };

    const invite = () => {
        router.push("/");
    };

    return (
        <div className="main">
            {viewMode === 'dashboard' ? <NewNavbar /> : <Navbar />}
            <div className="txbg">
                <div className="max-w-6xl w-[90%] mx-auto my-[60px]">
                    <div
                        className={`flex justify-end sm:justify-end md:justify-between lg:justify-between border-black border-b-0 p-[30px] shadow-lg ${
                            theme === "dark" ? "bg-black" : "bg-white"
                        } rounded-tl-[40px] rounded-tr-[40px] items-center`}
                    >
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
                        <div className="text-right flex items-end">
                            <div className="gap-4 flex">
                                <button
                                    onClick={leaderboard}
                                    className={`lg:px-[30px] lg:py-[10px] md:px-[30px] md:py-[10px] px-[20px] py-[10px] rounded-full hover:scale-110 duration-500 transition 0.3 sm:text-[10px] text-[10px] md:text-[15px] lg:text-[15px] ${
                                        theme === "dark"
                                            ? "bg-[#FFE500] text-[#363535]"
                                            : "bg-[#E265FF] text-white"
                                    }`}
                                >
                                    Leaderboard
                                </button>
                                {viewMode === 'default' && (
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
                                )}
                                {viewMode === 'dashboard' && (
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