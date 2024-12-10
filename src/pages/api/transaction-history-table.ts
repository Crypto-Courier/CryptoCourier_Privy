import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection } from '../../lib/getCollections';
import chainConfig from '../../config/chains'; // Update the import path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, chainId } = req.query;

  console.log('Received GET request for transactions', { walletAddress, chainId });

  if (!walletAddress && !chainId) {
    console.log('Wallet address is required');
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const collection = getTransactionCollection();

  try {

    // Convert chainId to an array if it's not already
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

    // const enrichedTransactions = await Promise.all(transactions.map(async (tx) => {
    //   // If it's a transaction sent by the current wallet
    //   if (tx.senderWallet === walletAddress) {
    //     // For transactions to an email address
    //     if (tx.recipientEmail) {
    //       // Check authentication status in the auth database
    //       const authRecord = await authCollection.findOne({ 
    //         email: tx.recipientEmail 
    //       });

    //       return {
    //         ...tx,
    //         claimStatus: authRecord?.authStatus === 'authenticated' ? 'claimed' : 'pending'
    //       };
    //     }
    //   }

    //   // For other cases, default to claimed or add your specific logic
    //   return {
    //     ...tx,
    //     claimStatus: 'claimed'
    //   };
    // }));

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
      console.log('No transactions found for this wallet with selected chain IDs');
      return res.status(404).json({ error: 'No transactions found for this wallet with selected chain IDs' });
    }

    res.status(200).json(enrichedTransactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
}