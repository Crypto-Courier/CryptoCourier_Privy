import { getTransactionCollection, getUserCollection } from '../lib/getCollections';
interface AuthData {
  [chainId: string]: {
    authStatus: boolean;
    gifterAddress?: string;
    universalDepth?: Record<string, number>;
    localDepth?: Record<string, number>;
  }
}

export const updateTransactionStatus = async (
  transactionHash: string
) => {

  // Validate input
  if (!transactionHash || !/^0x.+$/.test(transactionHash)) {
    throw new Error('Invalid transaction hash');
  }

  // Get the transaction model
  const TransactionModel = await getTransactionCollection();
  const UserModel = await getUserCollection();

  // Find the existing transaction
  const existingTransaction = await TransactionModel.findOne({ transactionHash });

  if (!existingTransaction) {
    throw new Error('Transaction not found');
  }

  // Determine claimer address and chain ID from existing transaction
  const claimerAddress = existingTransaction.claimerWallet.toLowerCase();
  const chainId = existingTransaction.chainId;

  // Find user by claimer wallet
  const user = await UserModel.findOne({
    claimerWallet: claimerAddress
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Prepare update object
  const updateData: any = {
    claimed: true,
    claimedAt: new Date()
  };

  // Check authentication status for this chain
  const authData = user.authData as Map<string, any>;
  console.log("What is auth data in the update controller", authData);
  const chainAuthData = authData.get(chainId);
  console.log("What is the chainAuth data for paricular chain in the update controller", chainAuthData);

  // Only update authentication if not already authenticated for this chain
  if (!chainAuthData || !chainAuthData?.authStatus) {
    console.log("What is the authStatus here", chainAuthData?.authStatus);
    updateData.authenticated = true;
    updateData.authenticatedAt = new Date();
  }

  // Update the transaction
  const updatedTransaction = await TransactionModel.findOneAndUpdate(
    { transactionHash },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );

  return updatedTransaction;
};