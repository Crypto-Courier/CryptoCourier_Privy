"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../dashboard/[walletAddress]/newNavbar";
import Footer from "../../components/Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import trophy from "../../assets/trophy.png";
import rankImage from "../../assets/rank.png";
import { LeaderboardEntry } from "../../types/types";

const LeaderBoard: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (err) {
        setError("Failed to load leaderboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  const invite = async () => {
    router.push("/");
  };

  return (
    <div className="main">
      <Navbar />

      <div className={`${theme === "dark" ? "txbgg1" : "txbgg2"}`}>
        <div
          className={`${
            theme === "dark"
              ? "bg-gradient-to-t to-[#0052FF]/[0.23] from-[#FF005C]/[0.23] py-[30px] backdrop-blur-[20px] h-full"
              : "bg-gradient-to-t to-[#FF005C]/[0.23] from-[#FE660A]/[0.23] py-[30px] backdrop-blur-[20px] h-full"
          }`}
        >
          <div className=" mx-auto my-8 md:my-12 lg:my-16 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 h-[55vh]">
              <div className="flex flex-col items-center lg:w-1/3">
                <Image
                  src={trophy}
                  alt="Trophy"
                  className="w-48 md:w-64 lg:w-80"
                />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mt-4 text-white">
                  Leaderboard
                </h1>
              </div>

              <div className="w-full lg:w-2/3  h-[60vh]">
                {isLoading ? (
                  <div className="h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-red-700 h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    {error}
                  </div>
                ) : (
                  <div className="">
                    <div className="w-full max-w-4xl mx-auto flex justify-end mb-4">
                      <button
                        onClick={invite}
                        className={`invite px-[30px] py-[10px] rounded-full hover:scale-110 duration-500 transition 0.3 ${
                          theme === "dark"
                            ? "bg-[#FFE500] text-[#363535]"
                            : "bg-[#FFFFFF] text-black"
                        }`}
                      >
                        Invite Your Friends
                      </button>
                    </div>
                    <div className="w-full max-w-4xl mx-auto  rounded-3xl">
                      <div className="overflow-y-auto h-[60vh]">
                        <div
                          className={`grid grid-cols-4 gap-2 p-2  rounded-md mb-2 ${
                            theme === "dark"
                              ? "bg-[#090406] border border-[#FE660A]"
                              : "bg-[#FFFCFC] border border-[#FFFFFF]"
                          }`}
                        >
                          {["Rank", "Gifter", "Claimer", "Claim Rate"].map(
                            (header, index) => (
                              <div
                                key={index}
                                className={`text-center font-semibold ${
                                  theme === "dark"
                                    ? "bg-gradient-to-r from-[#FFE500] to-[#FF3333] rounded-md mb-2 text-transparent bg-clip-text"
                                    : "bg-gradient-to-r from-[#FF336A] to-[#FF3333] rounded-md mb-2 text-transparent bg-clip-text"
                                }`}
                              >
                                {header}
                              </div>
                            )
                          )}
                        </div>
                        {leaderboardData.map((entry, index) => (
                          <div
                            key={entry.address}
                            className={` grid grid-cols-[5px_1fr_1fr_1fr_1fr] gap-2 h-[45px]  mb-1 last:mb-0 items-center rounded-md ${
                              theme === "dark"
                                ? "bg-[#000000]/[0.40] border border-[#E265FF]"
                                : "bg-[#FF3333]/[0.50] border border-[#FFFFFF]"
                            }`}
                          >
                            {/* Yellow Line */}
                            <div className="h-[70%] bg-[#FFE500] w-[2px]"></div>

                            {/* Rank Section */}
                            <div className="flex justify-center items-center">
                              <div className="w-8 h-8 relative">
                                <Image
                                  src={rankImage}
                                  alt="Rank"
                                  layout="fill"
                                  objectFit="contain"
                                />
                                <span className="inset-0 flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </span>
                              </div>
                            </div>

                            {/* Address */}
                            <div className="text-center text-white truncate">
                              {`${entry.address.substring(
                                0,
                                6
                              )}....${entry.address.slice(-4)}`}
                            </div>

                            {/* Invites */}
                            <div className="text-center text-white">
                              {entry.invites}
                            </div>

                            {/* Claims */}
                            <div className="text-center text-white">
                              {entry.claims}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
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

export default LeaderBoard;
