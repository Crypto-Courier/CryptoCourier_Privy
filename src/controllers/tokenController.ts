import { ethers } from "ethers";
import { getTokenCollection } from "../lib/getCollections";
import { AddToken } from "../types/add-token-types";

// Validation function
export const validateTokenData = (token: AddToken): string[] => {
  const errors: string[] = [];

  // Validate contract address
  if (
    !token.contractAddress ||
    !/^0x[a-fA-F0-9]{40}$/.test(token.contractAddress)
  ) {
    errors.push("Invalid contract address");
  }

  // Validate using ethers for additional address validation
  try {
    ethers.getAddress(token.contractAddress);
  } catch {
    errors.push("Invalid Ethereum contract address format");
  }

  // Validate symbol
  if (
    !token.symbol ||
    typeof token.symbol !== "string" ||
    token.symbol.trim().length === 0
  ) {
    errors.push("Symbol is required and must be a non-empty string");
  }

  // Validate name
  if (
    !token.name ||
    typeof token.name !== "string" ||
    token.name.trim().length === 0
  ) {
    errors.push("Name is required and must be a non-empty string");
  }

  // Validate chain ID
  if (!token.chainId || isNaN(Number(token.chainId)) || token.chainId <= 0) {
    errors.push("Chain ID is required and must be a positive number");
  }

  // Validate decimals
  if (
    token.decimals === undefined ||
    isNaN(Number(token.decimals)) ||
    token.decimals < 0 ||
    token.decimals > 18
  ) {
    errors.push("Decimals must be a number between 0 and 18");
  }

  return errors;
};

// Create or Add a new token
export const createToken = async (tokenData: AddToken) => {
  const TokenModel = await getTokenCollection();

  // Validate input
  const validationErrors = validateTokenData(tokenData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join("; "));
  }

  // Normalize token data
  const formattedToken = {
    ...tokenData,
    chainId: Number(tokenData.chainId),
    decimals: Number(tokenData.decimals),
    symbol: tokenData.symbol.trim().toUpperCase(),
    contractAddress: ethers.getAddress(tokenData.contractAddress),
  };

  // Check for existing token conflicts
  const existingToken = await TokenModel.findOne({
    $or: [
      { contractAddress: formattedToken.contractAddress },
      { symbol: formattedToken.symbol, chainId: formattedToken.chainId },
    ],
  });

  if (existingToken) {
    const conflictDetails =
      existingToken.contractAddress === formattedToken.contractAddress
        ? "Contract address already exists"
        : "Token symbol already exists for this chain";
    throw new Error(conflictDetails);
  }

  // Create and save the token
  const token = new TokenModel(formattedToken);
  return token.save();
};
