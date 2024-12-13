import { ethers } from 'ethers';
import { getTransactionCollection } from '../lib/getCollections';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateTransactionInput = (data: any) => {
  const {
    claimerWallet,
    gifterWallet,
    tokenAmount,
    tokenSymbol,
    claimerEmail,
    gifterEmail,
    chainId,
    transactionHash
  } = data;

  const errors: string[] = [];

  // Validate wallet addresses
  if (!ethers.isAddress(claimerWallet)) errors.push('Invalid claimer wallet address');
  if (!ethers.isAddress(gifterWallet)) errors.push('Invalid gifter wallet address');
  if (claimerWallet.toLowerCase() === gifterWallet.toLowerCase()) errors.push('Sender and recipient wallets cannot be the same');

  // Validate token amount
  if (!tokenAmount || isNaN(parseFloat(tokenAmount)) || parseFloat(tokenAmount) <= 0) {
    errors.push('Token amount must be a positive numeric value');
  }

  // Validate token symbol
  if (!tokenSymbol || tokenSymbol.trim().length === 0 || tokenSymbol.trim().length > 20) {
    errors.push('Token symbol must be a non-empty string with max 20 characters');
  }

  // Validate email addresses
  if (!emailRegex.test(claimerEmail)) errors.push('Invalid claimer email address');
  if (!emailRegex.test(gifterEmail)) errors.push('Invalid gifter email address');

  // Validate chain ID
  if (!chainId) errors.push('Chain ID is required');

  // Validate transaction hash
  if (!/^0x[a-fA-F0-9]{64}$/.test(transactionHash)) errors.push('Invalid transaction hash format');

  return errors;
};

export const createTransaction = async (transactionData: any) => {
  const TransactionModel = await getTransactionCollection();

  // Check if transaction hash already exists
  const existingTransaction = await TransactionModel.findOne({ transactionHash: transactionData.transactionHash });
  if (existingTransaction) {
    throw new Error('Transaction with this hash already exists');
  }

  // Create and save the transaction
  const transaction = new TransactionModel(transactionData);
  return transaction.save();
};
