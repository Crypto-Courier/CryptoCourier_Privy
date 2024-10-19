// src/pages/api/get-transactions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress, chainId } = req.query;

  console.log('Received GET request for transactions', { walletAddress, chainId });

  if (!walletAddress) {
    console.log('Wallet address and chain ID are required');
    return res.status(400).json({ error: 'Wallet address and chain ID are required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('transactionDB');
    const collection = db.collection('transactions');

    // Find transactions where the wallet is either the sender or the recipient
    const transactions = await collection.find({
      $and: [
        { $or: [{ senderWallet: walletAddress }, { recipientWallet: walletAddress }] },
        { chainId: chainId }
      ]
    }).project({
      senderWallet: 1,
      recipientWallet: 1,
      tokenAmount: 1,
      tokenSymbol: 1,
      customizedLink: 1,
      recipientEmail: 1,
      chainId: 1
    }).toArray();

    console.log(`Found ${transactions.length} transactions`);

    if (transactions.length === 0) {
      console.log('No transactions found for this wallet with connected chain ID');
      return res.status(404).json({ error: 'No transactions found for this wallet with connected chain ID' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
}