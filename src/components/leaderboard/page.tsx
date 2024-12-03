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

const LeaderBoard: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { walletData } = useWallet();
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [userDetails, setUserDetails] = useState<{
    rank?: number;
    invites: number;
    claims: number;
    address?: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isConnected = walletData?.authenticated;
  const activeAddress = walletData?.address;
  const isEmailConnected = walletData?.isEmailConnected;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // useEffect(() => {
  //   const fetchLeaderboardData = async () => {
  //     try {
  //       const response = await fetch("/api/leaderboard");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch leaderboard data");
  //       }
  //       const data = await response.json();
  //       setLeaderboardData(data);
  //     } catch (err) {
  //       setError("Failed to load leaderboard data");
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchLeaderboardData();
  // }, []);

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
          className={`${
            theme === "dark" ? " py-[30px]  h-full" : " py-[30px]  h-full"
          }`}
        >
          <div className=" mx-auto  px-4 sm:px-6 lg:px-8">
            <div className="w-full  mx-auto flex justify-end mb-4">
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
            <div className="flex flex-col lg:flex-row md:flex-row  justify-between gap-8 items-start">
              <div className="w-[40%] flex gap-5 flex-col items-center lg:w-1/3 hidden lg:flex md:flex sm:hidden ">
                <div className="flex flex-col border border-[#ffe600ba] py-6 w-[90%] bg-gradient-to-r to-[#000000dc] from-[#0051ff98] rounded-lg shadow-lg backdrop-blur-[20px]">
                  <div className="flex gap-7 items-center justify-evenly ">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <Image src={mask} width={100} alt="Rank" />
                        <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-xl">
                          {userDetails?.rank}
                        </span>
                      </div>
                      <div className="text-lg text-white mb-[15px]">
                        Your Rank
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 h-[12vh] justify-between">
                      <div className="  border-2 border-[#cfc45c9b] w-[65px] rounded-full p-4 flex items-center justify-center text-[#e7d748]  text-xl font-extrabold">
                        {userDetails?.invites}
                      </div>
                      <div className="text-lg text-white">Invited User</div>
                    </div>

                    <div className="flex flex-col items-center gap-2 justify-between h-[12vh]">
                      <div className="border-2  w-[65px]  border-[#cfc45c9b] rounded-full p-4 flex items-center justify-center text-[#FFE925] text-xl font-extrabold">
                        {userDetails?.claims}
                      </div>
                      <div className="text-lg text-white">Claimed User</div>
                    </div>
                  </div>
                </div>

                <h2 className="text-[#e7d748] text-2xl font-bold ">Top 3</h2>

                <div className="space-y-4 w-[90%]">
                  {[1, 2, 3].map((rank, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-around gap-4 py-4 px-6 bg-gradient-to-r from-[#40004ea1] to-[#b3000097] rounded-xl border backdrop-blur-[20px] ${
                        rank === 1
                          ? "border-[#FF3333]"
                          : rank === 2
                          ? "border-[#FF3333]"
                          : "border-[#FF3333]"
                      }`}
                    >
                      {rank === 1 && (
                        <Image
                          src={path1} // Replace with your image path
                          alt="First Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      {rank === 2 && (
                        <Image
                          src={path2} // Replace with your image path
                          alt="Second Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      {rank === 3 && (
                        <Image
                          src={path3} // Replace with your image path
                          alt="Third Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2"
                        />
                      )}
                      <div className="flex items-center  flex-col ">
                        <div className="relative">
                          {/* Conditional image based on rank */}

                          <Image
                            src={rank === 1 ? r1 : rank === 2 ? r2 : r3}
                            alt={`Rank ${rank}`}
                            width={50}
                          />
                          <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">
                            {rank}
                          </span>
                        </div>
                        <div className="text-white font-semibold text-md">
                          Oxa...Lla
                        </div>
                      </div>

                      <div className="flex flex-col items-center">
                        <div className="text-[#FFE500] font-bold text-lg">
                          23
                        </div>
                        <div className="text-white text-md mt-1">
                          Invited User
                        </div>
                      </div>

                      <div className="flex flex-col items-center ">
                        <div className="text-[#FFE500] font-bold text-lg">
                          12
                        </div>
                        <div className="mt-1 text-white text-md">
                          Claimed User
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-[60%]">
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
                    <div className="overflow-hidden rounded-md ">
                      <div
                        className={`grid grid-cols-4 gap-2 p-3 rounded-md  ${
                          theme === "dark"
                            ? " bg-black border border-[#FE660A]"
                            : " bg-white border border-[#FFFFFF]"
                        }`}
                      >
                        {["Rank", "Gifter", "Claimer", "Claim Rate"].map(
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
                      </div>
                      <div className="mt-2">
                        {currentItems.map((entry, index) => (
                          <div
                            key={entry.address}
                            className={`grid grid-cols-[5px_1fr_1fr_1fr_1fr] gap-2 h-[45px] mb-1 last:mb-0 items-center rounded-md backdrop-blur-[20px] ${
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
                    {/* {leaderboardData.length > itemsPerPage && (
                      <div className="flex justify-center items-center mt-4 space-x-2">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-4 py-2 rounded ${
                            currentPage === 1
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          Previous
                        </button>

                      
                        <span className="text-white">
                          Page {currentPage} of {totalPages}
                        </span>

                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-4 py-2 rounded ${
                            currentPage === totalPages
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          Next
                        </button>
                      </div>
                    )} */}
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
