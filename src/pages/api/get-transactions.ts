import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, chainId } = req.query;

  console.log('Received GET request for transactions', { walletAddress, chainId });

  if (!walletAddress && !chainId) {
    console.log('Wallet address is required');
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('transactionDB');
    const collection = db.collection('transactions');

    // Convert chainId to an array if it's not already
    const chainIds = Array.isArray(chainId) ? chainId : [chainId];

    // Find transactions where the wallet is either the sender or the recipient and chainId matches any in the list
    const transactions = await collection.find({
      $and: [
        { $or: [{ senderWallet: walletAddress }, { recipientWallet: walletAddress }] },
        { chainId: { $in: chainIds } }
      ]
    }).project({
      senderWallet: 1,
      recipientWallet: 1,
      tokenAmount: 1,
      tokenSymbol: 1,
      customizedLink: 1,
      recipientEmail: 1,
      senderEmail: 1,
      chainId: 1
    }).toArray();

    console.log(`Found ${transactions.length} transactions`);

    if (transactions.length === 0) {
      console.log('No transactions found for this wallet with selected chain IDs');
      return res.status(404).json({ error: 'No transactions found for this wallet with selected chain IDs' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
}
