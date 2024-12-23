import { getTransactionCollection, getUserCollection } from '../lib/getCollections';

export const updateTransactionStatus = async (
  transactionHash: string
) => {
  if (!transactionHash || !/^0x.+$/.test(transactionHash)) {
    throw new Error('Invalid transaction hash');
  }

  const TransactionModel = await getTransactionCollection();
  const UserModel = await getUserCollection();

  const existingTransaction = await TransactionModel.findOne({ transactionHash });
  if (!existingTransaction) {
    throw new Error('Transaction not found');
  }

  const claimerAddress = existingTransaction.claimerWallet.toLowerCase();
  const chainId = existingTransaction.chainId;

  // Find user and check auth status
  const user = await UserModel.findOne({ claimerWallet: claimerAddress });
  const authData = user?.authData as Map<string, any>;
  const chainAuthData = authData?.get(chainId);
  const isAuthenticated = chainAuthData?.authStatus === true;

  // Prepare update data
  const updateData: any = {
    claimed: true,
    claimedAt: new Date()
  };

  // Only set authenticated if user doesn't exist or chain not authenticated
  if (!isAuthenticated) {
    updateData.authenticated = true;
    updateData.authenticatedAt = new Date();
  }

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