import { ethers } from "ethers";
import { getTransactionCollection } from "../lib/getCollections";

// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate the transaction field before adding it into collection
export const validateTransactionInput = (data: any) => {
  const {
    claimerWallet,
    gifterWallet,
    tokenAmount,
    tokenSymbol,
    claimerEmail,
    gifterEmail,
    chainId,
    transactionHash,
  } = data;

  const errors: string[] = [];

  // Validate wallet addresses
  if (!ethers.isAddress(claimerWallet))
    errors.push("Invalid claimer wallet address");
  if (!ethers.isAddress(gifterWallet))
    errors.push("Invalid gifter wallet address");
  if (claimerWallet.toLowerCase() === gifterWallet.toLowerCase())
    errors.push("Claimer and Gifter wallets cannot be the same");

  // Validate token amount
  if (
    !tokenAmount ||
    isNaN(parseFloat(tokenAmount)) ||
    parseFloat(tokenAmount) <= 0
  ) {
    errors.push("Token amount must be a positive numeric value");
  }

  // Validate token symbol
  if (
    !tokenSymbol ||
    tokenSymbol.trim().length === 0 ||
    tokenSymbol.trim().length > 20
  ) {
    errors.push(
      "Token symbol must be a non-empty string with max 20 characters"
    );
  }

  // Validate email addresses
  if (!emailRegex.test(claimerEmail) && !ethers.isAddress(claimerEmail))
    errors.push("Invalid claimer email address");
  if (!emailRegex.test(gifterEmail) && !ethers.isAddress(gifterEmail))
    errors.push("Invalid gifter email address");

  // Validate chain ID
  if (!chainId) errors.push("Chain ID is required");

  // Validate transaction hash
  if (!/^0x.+$/.test(transactionHash))
    errors.push("Invalid transaction hash format");

  return errors;
};

// Add or Create new txn in transaction collection
export const createTransaction = async (transactionData: any) => {
  const TransactionModel = await getTransactionCollection();

  // Check if transaction hash already exists
  const existingTransaction = await TransactionModel.findOne({
    transactionHash: transactionData.transactionHash,
  });

  if (existingTransaction) {
    throw new Error("Transaction with this hash already exists");
  }

  // Create and save the transaction
  const transaction = new TransactionModel(transactionData);
  return transaction.save();
};
