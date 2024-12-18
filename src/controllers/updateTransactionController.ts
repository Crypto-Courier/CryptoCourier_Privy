import { getTransactionCollection } from '../lib/getCollections';

interface TransactionUpdateOptions {
  authenticate?: boolean;
  claim?: boolean;
}

export const updateTransactionStatus = async (
  transactionHash: string, 
  options: TransactionUpdateOptions = {}
) => {
  const { authenticate = false, claim = false } = options;

  // Validate input
  if (!transactionHash || !/^0x.+$/.test(transactionHash)) {
    throw new Error('Invalid transaction hash');
  }

  // Get the transaction model
  const TransactionModel = await getTransactionCollection();

  // Find the existing transaction
  const existingTransaction = await TransactionModel.findOne({ transactionHash });

  if (!existingTransaction) {
    throw new Error('Transaction not found');
  }

  // Prepare update object
  const updateData: any = {};

  // Authentication logic
  if (authenticate && !existingTransaction.authenticated) {
    updateData.authenticated = true;
    updateData.authenticatedAt = new Date();
  }

  // Claiming logic
  if (claim && !existingTransaction.claimed) {
    // Additional checks can be added here if needed
    updateData.claimed = true;
    updateData.claimedAt = new Date();
  }

  // Prevent unnecessary updates
  if (Object.keys(updateData).length === 0) {
    return existingTransaction;
  }

  // Update the transaction
  const updatedTransaction = await TransactionModel.findOneAndUpdate(
    { transactionHash },
    updateData,
    { 
      new: true,  // Return the updated document
      runValidators: true  // Run model validations
    }
  );

  return updatedTransaction;
};

// Example usage
export const handleTransactionAuthentication = async (transactionHash: string) => {
  try {
    const updatedTransaction = await updateTransactionStatus(transactionHash, { 
      authenticate: true 
    });
    return updatedTransaction;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

export const handleTransactionClaim = async (transactionHash: string) => {
  try {
    const updatedTransaction = await updateTransactionStatus(transactionHash, { 
      claim: true 
    });
    return updatedTransaction;
  } catch (error) {
    console.error('Claiming failed:', error);
    throw error;
  }
};