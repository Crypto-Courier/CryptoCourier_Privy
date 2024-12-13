"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import trophy from "../../assets/trophy.png";
import rankImage from "../../assets/rank.png";
import { LeaderboardEntry } from "../../types/types";
import { useWallet } from "../../context/WalletContext";
import QuizGamePopup from "../Game";
import mask from "../../assets/Mask.png";
import r1 from "../../assets/R1.png";
import r2 from "../../assets/R2.png";
import r3 from "../../assets/R3.png";
import path1 from "../../assets/path1.png";
import path2 from "../../assets/path2.png";
import path3 from "../../assets/path3.png";
import loader from "../../assets/processing.gif";
import SwitchHistory from "../SwitchHistory";
import FilterChainData from "../FilterChainData";

const LeaderBoard: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { walletData } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [topThreeUsers, setTopThreeUsers] = useState<LeaderboardEntry[]>([]);
  const [userDetails, setUserDetails] = useState<{
    rank?: number;
    invites: number;
    claims: number;
    address?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeAddress = walletData?.address;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination calculations

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const queryParams = activeAddress
          ? `?activeAddress=${activeAddress}`
          : "";

        const response = await fetch(`/api/leaderboard${queryParams}`);

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data = await response.json();

        // Update state with all users data
        setLeaderboardData(data.allUsers);

        setTopThreeUsers(data.topThreeUsers || []);
        // If user-specific data is available, you can use it
        if (data.userDetails) {
          setUserDetails({
            rank: data.userRank,
            invites: data.userDetails.invites,
            claims: data.userDetails.claims,
            address: data.userDetails.address,
          });
        }
      } catch (err) {
        setError("Failed to load leaderboard data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [activeAddress]); // Add activeAddress as a dependency

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  const invite = async () => {
    router.push("/send-token");
  };

  return (
    <div className="main">
      <Navbar />

      <div className={`${theme === "dark" ? "txbgg1" : "txbgg2"}`}>
        <div
          className={`h-[100vh] ${
            theme === "dark" ? " py-[30px]  h-full" : " py-[30px]  h-full"
          }`}
        >
          <div className=" mx-auto  px-4 sm:px-6 lg:px-8">
            <div className="w-full  mx-auto flex justify-end mb-4">
              <button
                onClick={invite}
                className={`invite px-[30px] py-[10px] rounded-full hover:scale-110 duration-500 transition 0.3 text-[12px] sm:text-[12px] md:text-lg lg:text-lg font-bold ${
                  theme === "dark"
                    ? "bg-[#FFE500] text-[#363535]"
                    : "bg-[#FFFFFF] text-black"
                }`}
              >
                Invite Your Friends
              </button>
            </div>
            <div className="flex flex-col lg:flex-row md:flex-col  justify-between gap-8 items-start">
              <div className="md:w-[100%] lg:w-[40%] sm:w-full w-full flex gap-5 flex-col items-center  lg:flex md:flex  ">
                <div className="flex flex-col border border-[#ffe600ba] py-6 w-[90%] bg-gradient-to-r to-[#000000dc] from-[#0051ff98] rounded-lg shadow-lg backdrop-blur-[20px]">
                  <div className="flex flex-row  justify-evenly items-center gap-4">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="relative lg:w-[80px] lg:h-[80px] md:w-[60px] md:h-[60px] sm:w-[60px] sm:h-[60px] ">
                        <Image
                          src={mask}
                          alt="Rank"
                          className="w-full h-full object-contain"
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-lg">
                          {userDetails?.rank}
                        </span>
                      </div>
                      <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold">
                        Your Rank
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      {userDetails ? (
                        <>
                          <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] border-[3px] border-yellow-400 rounded-full">
                            <span className="text-yellow-300  font-bold">
                              {userDetails.invites}
                            </span>
                          </div>
                          <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold mt-2">
                            Invited User
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Image
                            src={loader}
                            alt="Loading"
                            width={40}
                            height={40}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-center">
                      {userDetails ? (
                        <>
                          <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] border-[3px] border-yellow-400 rounded-full">
                            <span className="text-yellow-300 text-lg sm:text-2xl font-bold">
                              {userDetails.claims}
                            </span>
                          </div>
                          <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold mt-2">
                            Claimed User
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center">
                          <Image
                            src={loader}
                            alt="Loading"
                            width={40}
                            height={40}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* ....... */}

                <h2 className="text-[#e7d748] lg:text-2xl text-2xl md:text-2xl sm:text-2xl font-bold ">
                  Top 3
                </h2>

                <div className="space-y-4 w-[90%]">
                  {topThreeUsers.map((user, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-around gap-4 py-4 px-6 bg-gradient-to-r from-[#40004ea1] to-[#b3000097] rounded-xl border backdrop-blur-[20px] ${
                        index === 0
                          ? "border-[#FF3333]"
                          : index === 1
                          ? "border-[#FF3333]"
                          : "border-[#FF3333]"
                      }`}
                    >
                      {index === 0 && (
                        <Image
                          src={path1} // Replace with your image path
                          alt="First Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      {index === 1 && (
                        <Image
                          src={path2} // Replace with your image path
                          alt="Second Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      {index === 2 && (
                        <Image
                          src={path3} // Replace with your image path
                          alt="Third Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      <div className="flex items-center  flex-col ">
                        <div className="relative ">
                          {/* Conditional image based on rank */}

                          <Image
                            src={index === 0 ? r1 : index === 1 ? r2 : r3}
                            alt={`Rank ${index + 1}`}
                            width={50}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-white font-bold lg:text-lg text-[12px] sm:text-[12px] md:text-lg">
                            {index + 1}
                          </span>
                        </div>
                        <div className="text-white font-semibold lg:text-lg text-[12px] sm:text-[12px] md:text-lg">
                          {`${user.address.slice(0, 4)}...${user.address.slice(
                            -4
                          )}`}
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-[#FFE500] font-bold text-lg">
                          {user.invites}
                        </div>
                        <div className="text-white lg:text-lg text-[12px] sm:text-[12px] md:text-lg mt-1">
                          Invited User
                        </div>
                      </div>

                      <div className="flex flex-col items-center ">
                        <div className="text-[#FFE500] font-bold text-lg">
                          {user.claims}
                        </div>
                        <div className="mt-1 text-white lg:text-lg text-[12px] sm:text-[12px] md:text-lg">
                          Claimed User
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-[100%] lg:w-[60%] w-full sm:w-full">
                {isLoading ? (
                  <div className="h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    Loading...
                  </div>
                ) : error ? (
                  <div className="text-red-700 h-40 md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                    {error}
                  </div>
                ) : (
                  <div className="w-full  rounded-3xl">
                    <FilterChainData
                      onChainSelect={function (selectedChains: number[]): void {
                        throw new Error("Function not implemented.");
                      }}
                    />

                    <div className="overflow-hidden rounded-md ">
                      <div
                        className={`lg:text-lg text-[12px] sm:text-[12px] md:text-lg grid grid-cols-4 gap-2 p-3 rounded-md  ${
                          theme === "dark"
                            ? " bg-black border border-[#FE660A]"
                            : " bg-white border border-[#FFFFFF]"
                        }`}
                      >
                        {["Rank", "Inviter", "Claimer", "Claim Rate"].map(
                          (header, index) => (
                            <div
                              key={index}
                              className={`text-center font-semibold mb-0 bg-black ${
                                theme === "dark"
                                  ? "bg-gradient-to-r from-[#FFE500] to-[#FF3333] rounded-md mb-2 text-transparent bg-clip-text"
                                  : "bg-gradient-to-r from-[#FF336A] to-[#FF3333] rounded-md mb-2 text-transparent bg-clip-text"
                              }`}
                            >
                              {header}
                            </div>
                          )
                        )}
                      </div>{" "}
                      <div className="mt-2 ">
                        {currentItems.map((entry, index) => (
                          <div
                            key={entry.address}
                            className={`grid grid-cols-[5px_1fr_1fr_1fr_1fr] gap-2 h-[45px] mb-1 last:mb-0 items-center rounded-md backdrop-blur-[50px]  ${
                              theme === "dark"
                                ? "bg-[#000000]/40 border border-[#ddcb2cb2]"
                                : "bg-[#FF3333]/40 border border-[#FFFFFF]"
                            }`}
                          >
                            {/* Yellow Line */}
                            <div className="h-[70%] bg-[#FFE500] w-[2px]"></div>

                            {/* Rank Section */}
                            <div className="flex justify-center items-center  backdrop-blur-20 p-2 rounded-md">
                              <div className="relative w-8 h-8">
                                <Image
                                  src={rankImage}
                                  alt="Rank"
                                  layout="fill"
                                  objectFit="contain"
                                />
                                <span className="bottom-[10px] absolute inset-0 flex items-center justify-center text-white font-bold">
                                  {indexOfFirstItem + index + 1}
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
                    {/* Conditional Pagination - Only show if more than 10 entries */}

                    {leaderboardData.length > itemsPerPage && (
                      <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded ${
                            currentPage === 1
                              ? "bg-black cursor-not-allowed border border-[#FE660A]"
                              : "bg-[#FFE500] text-[#363535]"
                          }`}
                        >
                          Previous
                        </button>

                        <span className="text-white">
                          {currentPage} of {totalPages}
                        </span>

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded ${
                            currentPage === totalPages
                              ? "bg-black cursor-not-allowed border border-[#FE660A]"
                              : "bg-[#FFE500] text-[#363535]"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )}
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
