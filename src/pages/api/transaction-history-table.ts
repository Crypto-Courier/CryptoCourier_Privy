import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection } from '../../lib/getCollections';
import chainConfig from '../../config/chains';
import { handleError } from '../../utils/api-error-handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, chainId } = req.query;

  console.log('Received GET request for transactions', { walletAddress, chainId });

  if (!walletAddress && !chainId) {
    return handleError(res, 400, 'Wallet address and ChainId is required');
  }

  const collection = getTransactionCollection();

  try {

    // Convert chainId to an array for multiple chainId
    const chainIds = Array.isArray(chainId) ? chainId : [chainId];

    // Find transactions where the wallet is either the sender or the recipient and chainId matches any in the list
    const transactions = await (await collection).find({
      $and: [
        { $or: [{ senderWallet: walletAddress }, { recipientWallet: walletAddress }] },
        { chainId: { $in: chainIds } }
      ]
    }).project({
      senderWallet: 1,
      recipientWallet: 1,
      tokenAmount: 1,
      tokenSymbol: 1,
      transactionHash: 1,
      recipientEmail: 1,
      senderEmail: 1,
      chainId: 1,
      claimed: 1
    }).toArray();

    const enrichedTransactions = transactions.map((tx) => {
      const chainInfo = chainConfig[tx.chainId];
      const customizedLink = chainInfo
        ? `${chainInfo.blockexplorer}/${tx.transactionHash}`
        : null;

      return {
        ...tx,
        customizedLink,
      };
    });

    console.log(`Found ${enrichedTransactions.length} transactions`);

    if (enrichedTransactions.length === 0) {
      return handleError(res, 404, 'No transactions found for this wallet with selected chain IDs');
    }

    res.status(200).json(enrichedTransactions);
  } catch (error) {
    return handleError(res, 500, 'Failed to retrieve transactions')
  }
}