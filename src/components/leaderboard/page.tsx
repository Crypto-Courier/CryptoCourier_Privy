"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../../styles/History.css";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useTheme } from "next-themes";
import Image from "next/image";
import invited from "../../assets/invite.svg";
import global from "../../assets/g-dark.png";
import monthly from "../../assets/m-dark.png";
import global2 from "../../assets/g-dark2.png";
import monthly2 from "../../assets/m-dark2.png";
import rankImage from "../../assets/rank.png";
import { useWallet } from "../../context/WalletContext";
import mask from "../../assets/Mask.png";
import r1 from "../../assets/R1.png";
import r2 from "../../assets/R2.png";
import r3 from "../../assets/R3.png";
import path1 from "../../assets/path1.png";
import path2 from "../../assets/path2.png";
import path3 from "../../assets/path3.png";
import loader from "../../assets/processing.gif";
import loading from "../../assets/loader.gif";
import FilterChainData from "../FilterChainData";
import {
  LeaderboardEntry,
  LeaderboardResponse,
} from "../../types/leaderboard-types";
import { Tooltip } from "antd";
import WalletPopup from "../WalletPopup";
import MonthYearPicker from "../MonthYearPicker";
import Signature from "../Signature";

// Define the list of supported chains
const SUPPORTED_CHAINS = [
  8453, 919, 34443, 11155111, 291, 7560, 7777777, 1135, 255, 10, 252, 480, 288,
  185, 690, 360, 254, 8866, 1750, 5112, 2192, 888888888,
];

const LeaderBoard: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { walletData } = useWallet();
  const [selectedChains, setSelectedChains] =
    useState<number[]>(SUPPORTED_CHAINS);
  const [userHasSelected, setUserHasSelected] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [topThreeUsers, setTopThreeUsers] = useState<LeaderboardEntry[]>([]);
  const [userDetails, setUserDetails] = useState<LeaderboardEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Format: "MM/YYYY"
  const [activeButton, setActiveButton] = useState("Global");

  const activeAddress = walletData?.address;

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getEmptyLeaderboardEntry = (address: string): LeaderboardEntry => ({
    address,
    invites: 0,
    claims: 0,
    transactions: [],
    points: {
      total: 0,
      byChain: selectedChains.map((chain) => ({
        chainId: chain.toString(),
        points: 0,
      })),
    },
    rank: 0,
  });

  const handleChainSelect = (chains: number[]) => {
    setSelectedChains(chains);
  };

  // const handleSuccess = (txHash:string) => {
  //   console.log('Gift claimed successfully!', txHash);
  // };

  // const handleError = (error:any) => {
  //   console.error('Failed to claim gift:', error);
  // };

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        setLeaderboardData([]);
        setTopThreeUsers([]);
        setUserDetails(null);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        if (activeAddress) {
          params.append("activeAddress", activeAddress);
        }
        if (selectedChains.length === 1) {
          params.append("chainId", selectedChains[0].toString());
        }
        if (activeButton === "Monthly" && selectedMonth) {
          params.append("month", selectedMonth);
        }

        // Choose API endpoint based on active button
        const endpoint =
          activeButton === "Global"
            ? "/api/global-leaderboard-data"
            : "/api/monthly-leaderboard-data";

        const response = await fetch(`${endpoint}?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard data");
        }

        const data: LeaderboardResponse = await response.json();

        if (data.status === "error") {
          throw new Error(data.error || "Unknown error");
        }

        // Handle empty data case with proper type checking
        if (!data.allUsers || data.allUsers.length === 0) {
          if (activeAddress) {
            const emptyEntry = getEmptyLeaderboardEntry(activeAddress);
            setLeaderboardData([emptyEntry]);
            setTopThreeUsers([emptyEntry]);
            setUserDetails(emptyEntry);
          } else {
            setLeaderboardData([]);
            setTopThreeUsers([]);
            setUserDetails(null);
          }
        } else {
          setLeaderboardData(data.allUsers);
          setTopThreeUsers(data.topThreeUsers || []);
          if (data.userDetails) {
            setUserDetails(data.userDetails);
          } else if (activeAddress) {
            setUserDetails(getEmptyLeaderboardEntry(activeAddress));
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load leaderboard data"
        );
        console.error(err);

        // Set empty state on error
        if (activeAddress) {
          const emptyEntry = getEmptyLeaderboardEntry(activeAddress);
          setLeaderboardData([emptyEntry]);
          setTopThreeUsers([emptyEntry]);
          setUserDetails(emptyEntry);
        } else {
          setLeaderboardData([]);
          setTopThreeUsers([]);
          setUserDetails(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [
    activeAddress,
    selectedChains,
    activeButton,
    selectedMonth,
    userHasSelected,
  ]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = leaderboardData.slice(indexOfFirstItem, indexOfLastItem);
  console.log("Hello current item", currentItems);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(leaderboardData.length / itemsPerPage);

  const invite = async () => {
    router.push("/send-token");
  };

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };

  return (
    <div className="main">
      <Navbar />

      <div className={`${theme === "dark" ? "txbgg1" : "txbgg2"}`}>
        <div
          className={`h-[100vh] ${
            theme === "dark" ? " py-[30px] " : " py-[30px]  "
          }`}
        >
          <div className=" mx-auto  px-4 sm:px-6 lg:px-8  ">
            <div className="lg:w-[60%] md:w-[60%] sm:w-[100%] w-100% mr-0 ml-auto flex justify-end mb-4 gap-5">
              <div>
                <button
                  onClick={() => setActiveButton("Global")}
                  className={`invite px-[30px] py-[10px] rounded-tl-lg rounded-tr-none rounded-bl-lg text-[12px] sm:text-[12px] md:text-lg lg:text-lg font-bold ${
                    activeButton === "Global"
                      ? theme === "dark"
                        ? "bg-[#FFE500] text-[#1E1E1E]"
                        : "bg-[#E265FF] text-white"
                      : theme === "dark"
                      ? "bg-[#1E1E1E] text-[#FFE500]"
                      : "bg-white text-black"
                  }`}
                >
                  Global
                </button>

                <button
                  onClick={() => setActiveButton("Monthly")}
                  className={`invite px-[30px] py-[10px] rounded-tr-lg rounded-tl-none rounded-br-lg text-[12px] sm:text-[12px] md:text-lg lg:text-lg font-bold ${
                    activeButton === "Monthly"
                      ? theme === "dark"
                        ? "bg-[#FFE500] text-[#1E1E1E]"
                        : "bg-[#E265FF] text-white"
                      : theme === "dark"
                      ? "bg-[#1E1E1E] text-[#FFE500]"
                      : "bg-white text-black"
                  }`}
                >
                  Monthly
                </button>
              </div>

              <Tooltip title="Invite Your Friends">
                <button
                  onClick={invite}
                  className={`lg:px-[20px] lg:py-[10px] md:px-[20px] md:py-[10px] px-[20px] py-[10px] rounded-lg hover:scale-110 duration-500 transition 0.3 sm:text-[10px] text-[10px] md:text-[15px] lg:text-[15px] ${
                    theme === "dark"
                      ? "text-[#363535] bg-[#FFE500] hover:bg-gradient-to-b from-[#d5d5d5d2] to-[#FFE500]"
                      : "text-white bg-[#E265FF] hover:bg-gradient-to-b  from-[#d5d5d5d2] to-[#E265FF]"
                  }`}
                >
                  <Image src={invited} width={20} alt="" />
                </button>
              </Tooltip>
            </div>
            <div className="flex flex-col lg:flex-row md:flex-col  justify-between gap-8 items-start">
              <div className="md:w-[100%] lg:w-[40%] sm:w-full w-full flex gap-5 flex-col items-center  lg:flex md:flex  ">
                <div className="flex flex-col border border-[#ffe600ba] py-6 lg:w-[90%] md:w-[90%] sm:w-[100%] w-[100%] bg-gradient-to-r to-[#000000dc] from-[#0051ff98] rounded-lg shadow-lg backdrop-blur-[20px]">
                  <div className="flex flex-row  justify-evenly itemms-center gap-4">
                    <div className="flex flex-col items-center gap-2 mb-3">
                      <div className="relative lg:w-[80px] lg:h-[80px] md:w-[60px] md:h-[60px] sm:w-[60px] sm:h-[60px] h-[60px] w-[60px] ">
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

                    <div className="flex flex-col items-center justify-center">
                      {userDetails ? (
                        <>
                          <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full">
                            <span className="text-yellow-300 text-lg sm:text-2xl">
                              {userDetails.invites}
                            </span>
                          </div>
                          <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold lg:mt-[20px] md:mt-[20px] mt-[15px] sm:mt-[15px]">
                            Invited
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

                    <div className="flex flex-col items-center justify-center">
                      {userDetails ? (
                        <>
                          <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full">
                            <span className="text-yellow-300 text-lg sm:text-2xl ">
                              {userDetails.claims}
                            </span>
                          </div>
                          <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold lg:mt-[20px] md:mt-[20px] mt-[15px] sm:mt-[15px]">
                            Claimed
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
                    <div className="flex flex-col items-center justify-center">
                      {userDetails ? (
                        <>
                          <div className="flex items-center justify-center w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]  rounded-full">
                            <span className="text-yellow-300 text-lg sm:text-2xl ">
                              {userDetails?.points?.total || 0}
                            </span>
                          </div>
                          <div className="text-white text-[12px] sm:text-[12px] lg:text-lg md:text-lg font-semibold lg:mt-[20px] md:mt-[20px] mt-[15px] sm:mt-[15px] ">
                            Points
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

                <div className="space-y-4 lg:w-[90%] md:w-[100%] sm:w-[100%] w-[100%]">
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
                          className="absolute lg:top-6 md:top-6 sm:top-7 top-7 left-0 transform -translate-x-1/2 lg:w-[50px] md:w-[50px] sm:w-[30px] w-[30px] "
                        />
                      )}
                      {index === 1 && (
                        <Image
                          src={path2} // Replace with your image path
                          alt="Second Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2 "
                        />
                      )}
                      {index === 2 && (
                        <Image
                          src={path3} // Replace with your image path
                          alt="Third Rank Badge"
                          width={50}
                          className="absolute top-6 left-0 transform -translate-x-1/2 "
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

                      <div className="flex flex-col items-center justify-center">
                        <div className="text-[#FFE500] font-bold text-lg">
                          {user.invites}
                        </div>
                        <div className="text-white lg:text-lg text-[12px] sm:text-[12px] md:text-lg mt-1">
                          Invited
                        </div>
                      </div>

                      <div className="flex flex-col items-center justify-center">
                        <div className="text-[#FFE500] font-bold text-lg">
                          {user.claims}
                        </div>
                        <div className="mt-1 text-white lg:text-lg text-[12px] sm:text-[12px] md:text-lg">
                          Claimed
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-[#FFE500] font-bold text-lg">
                          {user?.points?.total || 0}
                        </div>
                        <div className="text-white lg:text-lg text-[12px] sm:text-[12px] md:text-lg mt-1">
                          Point
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:w-[100%] lg:w-[60%] w-full sm:w-full">
                <div className="w-full  rounded-3xl relative ">
                  <div className="flex justify-end mb-2">
                    {activeButton === "Monthly" && (
                      <MonthYearPicker
                        onMonthSelect={handleMonthSelect}
                        selectedMonth={selectedMonth}
                      />
                    )}
                  </div>
                  <FilterChainData
                    onChainSelect={handleChainSelect}
                    selectedChains={selectedChains}
                    userHasSelected={userHasSelected}
                    onUserSelectChange={setUserHasSelected}
                  />

                  <div className="overflow-hidden rounded-md ">
                    <div
                      className={`lg:text-lg text-[12px] sm:text-[12px] md:text-lg grid grid-cols-5 gap-2 p-3 rounded-md  ${
                        theme === "dark"
                          ? " bg-black border border-[#FE660A]"
                          : " bg-white border border-[#FFFFFF]"
                      }`}
                    >
                      {["Rank", "Inviter", "Claimer", "Rate", "Points"].map(
                        (header, index) => (
                          <div
                            key={index}
                            className={`text-center font-semibold mb-0 bg-black ${
                              theme === "dark"
                                ? "bg-gradient-to-r from-[#FFE500] to-[#FF3333] rounded-md  text-transparent bg-clip-text"
                                : "bg-gradient-to-r from-[#FF336A] to-[#FF3333] rounded-md  text-transparent bg-clip-text"
                            }`}
                          >
                            {header}
                          </div>
                        )
                      )}
                    </div>
                    {isLoading ? (
                      <div className=" md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                        <Image
                          src={loading} // Replace with your image path
                          alt="loading"
                          width={50}
                          // className="absolute top-6 left-0 transform -translate-x-1/2 "
                        />
                      </div>
                    ) : error ? (
                      <div className="text-red-700  md:h-60 lg:h-80 flex justify-center items-center text-lg md:text-xl">
                        {error}
                      </div>
                    ) : (
                      <div className="mt-2 ">
                        {currentItems.map((entry, index) => (
                          <div
                            key={entry.address}
                            className={`relative z-20 grid grid-cols-[5px_1fr_1fr_1fr_1fr_1fr] gap-2 h-[45px] mb-1 last:mb-0 items-center rounded-md backdrop-blur-[50px]  ${
                              theme === "dark"
                                ? "bg-[#000000]/50 border border-[#ddcb2cb2]"
                                : "bg-[#000000]/50 border border-[#E265FF]"
                            }`}
                          >
                            {/* Yellow Line */}
                            <div
                              className={`h-[70%]  w-[2px]  ${
                                theme === "dark"
                                  ? "bg-[#FFE500]"
                                  : "bg-[#E265FF]"
                              }`}
                            ></div>

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

                            {/* Points */}
                            <div className="text-center text-white">
                              {entry.points?.total || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
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
                <Signature
                  chainId={11155111} // 1 for Ethereum, 137 for Polygon, etc.
                  giftId={1} // Your gift ID
                />
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
