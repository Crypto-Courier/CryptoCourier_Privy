import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection } from '../../lib/getCollections';
import chainConfig from '../../config/chains';
import { handleError } from '../../utils/api-error-handler';

// Interface for enriched transaction
export interface EnrichedTransaction {
  _id: string;
  claimerWallet: string;
  gifterWallet: string;
  tokenAmount: string;
  tokenSymbol: string;
  transactionHash: string;
  claimerEmail: string;
  gifterEmail: string;
  chainId: string;
  claimed: boolean;
  customizedLink: string;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Handle only GET requests
  if (req.method !== 'GET') {
    return handleError(res, 405, 'Method not allowed');
  }

  const { walletAddress, chainId } = req.query;

  console.log('Received GET request for transactions', { walletAddress, chainId });

  // Validate input
  if (!walletAddress || !chainId) {
    return handleError(res, 400, 'Wallet address and ChainId are required');
  }

  try {
    // Establish database connection
    const TransactionModel = await getTransactionCollection();

    // Convert chainId to an array for multiple chainIds
    const chainIds = Array.isArray(chainId) 
      ? chainId.map(String) 
      : [String(chainId)];

    // Find transactions where the wallet is either the claimer or gifter and chainId matches
    const transactions = await TransactionModel.find({
      $and: [
        { 
          $or: [
            { claimerWallet: walletAddress }, 
            { gifterWallet: walletAddress }
          ] 
        },
        { chainId: { $in: chainIds } }
      ]
    }).select({
      claimerWallet: 1,
      gifterWallet: 1,
      tokenAmount: 1,
      tokenSymbol: 1,
      transactionHash: 1,
      claimerEmail: 1,
      gifterEmail: 1,
      chainId: 1,
      claimed: 1
    });

    // Enrich transactions with block explorer links
    const enrichedTransactions: EnrichedTransaction[] = transactions.map((tx) => {
      const chainInfo = chainConfig[tx.chainId];
      const customizedLink = `${chainInfo.blockexplorer}/${tx.transactionHash}`;

      return {
        _id: tx._id.toString(),
        claimerWallet: tx.claimerWallet,
        gifterWallet: tx.gifterWallet,
        tokenAmount: tx.tokenAmount,
        tokenSymbol: tx.tokenSymbol,
        transactionHash: tx.transactionHash,
        claimerEmail: tx.claimerEmail,
        gifterEmail: tx.gifterEmail,
        chainId: tx.chainId,
        claimed: tx.claimed,
        customizedLink,
      };
    });

    console.log(`Found ${enrichedTransactions.length} transactions`);

    if (enrichedTransactions.length === 0) {
      return handleError(res, 404, 'No transactions found for this wallet with selected chain IDs');
    }

    res.status(200).json(enrichedTransactions);
  } catch (error) {
    console.error('Transaction fetch error:', error);
    return handleError(res, 500, 'Failed to retrieve transactions');
  }
}