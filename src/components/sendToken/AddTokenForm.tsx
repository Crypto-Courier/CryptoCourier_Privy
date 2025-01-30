import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { AddToken, AddTokenFormProps } from "../../types/add-token-types";
import { useChainId } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";

const AddTokenForm: React.FC<AddTokenFormProps> = ({ onClose, onAddToken }) => {
  const chainId = useChainId();
  const { theme } = useTheme();
  const [newToken, setNewToken] = useState<Partial<AddToken>>({
    contractAddress: "",
    name: "",
    symbol: "",
    decimals: undefined,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenFetched, setTokenFetched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { getAccessToken } = usePrivy();

  useEffect(() => {
    const fetchTokenDetails = async () => {
      const token = await getAccessToken();
      if (newToken.contractAddress && newToken.contractAddress.length === 42) {
        setError(null);
        setIsFetching(true);

        try {
          const res = await fetch("/api/getTokenDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              tokenAddress: newToken.contractAddress,
              chainId,
            }),
          });

          const data = await res.json();

          if (res.status === 200) {
            setNewToken({
              ...newToken,
              name: data.name,
              symbol: data.symbol,
              decimals: Number(data.decimals),
            });
            setTokenFetched(true);
          } else {
            setError(data.message || "Error fetching token details");
            setTokenFetched(false);
          }
        } catch (err) {
          setError("An unexpected error occurred");
          setTokenFetched(false);
        } finally {
          setIsFetching(false);
        }
      } else {
        setTokenFetched(false);
        setNewToken({
          ...newToken,
          name: "",
          symbol: "",
          decimals: undefined,
        });
      }
    };

    fetchTokenDetails();
  }, [newToken.contractAddress]);

  const handleAddToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      tokenFetched &&
      newToken.contractAddress &&
      newToken.name &&
      newToken.symbol &&
      newToken.decimals !== undefined
    ) {
      onAddToken(newToken as AddToken);
      onClose();
    }
  };

  useEffect(() => {
    // Function to detect clicks outside the modal
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // Close the modal when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center w-[100%] mx-auto`}
    >
      <div
        ref={modalRef}
        className={`rounded-lg lg:max-w-[30%] md:max-w-[70%] sm:max-w-[80%] max-w-[80%] w-full relative ${
          theme === "dark"
            ? "bg-[#000000]/50 border-red-500 border backdrop-blur-[10px]"
            : "bg-[#FFFCFC] border border-[#FE005B]/60"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-[1rem] text-gray-500 hover:text-gray-200 text-[25px]"
        >
          &times;
        </button>

        <h2
          className={`lg:text-2xl md:text-2xl sm:text-2xl text-md font-bold mb-4 lg:p-6 md:p-6 sm:p-6 p-4 rounded-tr-[10px] rounded-tl-[10px] text-center ${
            theme === "dark"
              ? "bg-[#171717] border-b-2 border-red-500"
              : "bg-white border-b-2 border-[#FE005B]"
          }`}
        >
          Add New Token
        </h2>

        <form onSubmit={handleAddToken} className="mx-7 my-2">
          <div className="mb-2">
            <label
              className={`block text-sm font-medium text-gray-700 mb-2 ${
                theme === "dark" ? "text-white" : "text-black"
              }`}
            >
              Contract Address
            </label>
            <input
              type="text"
              value={newToken.contractAddress}
              onChange={(e) =>
                setNewToken({ ...newToken, contractAddress: e.target.value })
              }
              className={`w-full bg-opacity-50 rounded-[7px] p-1 border border-gray-500 focus-none ${
                theme === "dark"
                  ? "bg-[#151515] text-white"
                  : "bg-[#FFFCFC] text-gray-800"
              }`}
              required
            />
          </div>

          {isFetching && (
            <p className="text-blue-500 mb-2">Fetching token details...</p>
          )}

          {tokenFetched && (
            <>
              <div className="mb-2">
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Symbol
                </label>
                <input
                  type="text"
                  value={newToken.symbol}
                  disabled
                  className={`w-full bg-opacity-50 rounded-[7px] p-1 border border-gray-500 focus-none ${
                    theme === "dark"
                      ? "bg-[#151515] text-white"
                      : "bg-[#FFFCFC] text-gray-800"
                  }`}
                />
              </div>
              <div className="mb-2">
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Name
                </label>
                <input
                  type="text"
                  value={newToken.name}
                  disabled
                  className={`w-full bg-opacity-50 rounded-[7px] p-1 border border-gray-500 focus-none ${
                    theme === "dark"
                      ? "bg-[#151515] text-white"
                      : "bg-[#FFFCFC] text-gray-800"
                  }`}
                />
              </div>
              <div className="mb-4">
                <label
                  className={`block text-sm font-medium text-gray-700 mb-2 ${
                    theme === "dark" ? "text-white" : "text-black"
                  }`}
                >
                  Decimals
                </label>
                <input
                  type="number"
                  value={newToken.decimals || ""}
                  disabled
                  className={`w-full bg-opacity-50 rounded-[7px] p-1 border border-gray-500 focus-none ${
                    theme === "dark"
                      ? "bg-[#151515] text-white"
                      : "bg-[#FFFCFC] text-gray-800"
                  }`}
                />
              </div>
            </>
          )}

          {error && <p className="text-red-500 mb-2">{error}</p>}

          <div className="flex justify-center space-x-2 mb-7 mt-7 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2  text-white  border-[#FF336A]  border rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover:scale-110 duration-500 transition 0.3 px-4 py-2  text-white  bg-[#FF336A] hover:bg-gradient-to-b  from-[#d5d5d5d2] to-[#FF336A] rounded-md shadow-sm text-sm font-medium"
              disabled={!tokenFetched}
            >
              Add Token
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTokenForm;
