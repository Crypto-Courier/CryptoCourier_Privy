import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { NewToken, AddTokenFormProps } from "../../types/types"; // Make sure this import path is correct


const AddTokenForm: React.FC<AddTokenFormProps> = ({ onClose, onAddToken }) => {
  const { theme } = useTheme();
  const [newToken, setNewToken] = useState<Partial<NewToken>>({
    contractAddress: "",
    name: "",
    symbol: "",
    decimals: undefined,
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tokenFetched, setTokenFetched] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (newToken.contractAddress && newToken.contractAddress.length === 42) {
        // Basic check for Ethereum address length
        setError(null);
        setIsFetching(true);

        try {
          const res = await fetch("/api/getTokenDetails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ tokenAddress: newToken.contractAddress }),
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
      onAddToken(newToken as NewToken);
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
        className={`rounded-lg max-w-[40%] w-full relative ${
          theme === "dark"
            ? "bg-[#000000]/50 border-red-500 border backdrop-blur-[10px]"
            : "bg-[#FFFCFC] border border-[#FE005B]/60"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-0 right-[1rem] text-gray-500 hover:text-gray-700 text-[25px]"
        >
          &times;
        </button>

        <h2
          className={`text-2xl font-bold mb-4 p-6 rounded-tr-[10px] rounded-tl-[10px] text-center ${
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

          <div className="flex justify-center space-x-2 mb-7 mt-7">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#FF336A] text-[#FF336A] rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="hover:scale-110 duration-500 transition 0.3 px-4 py-2 border border-red-300 text-white font-medium bg-[#FF336A] rounded-md shadow-sm text-sm font-medium"
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
