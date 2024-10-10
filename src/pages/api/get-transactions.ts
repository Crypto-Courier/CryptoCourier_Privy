// src/pages/api/get-transactions.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;

  if (!walletAddress) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('transactionDB');
    const collection = db.collection('transactions');

    // Find transactions where the wallet is either the sender or the recipient
    const transactions = await collection.find({
      $or: [
        { senderWallet: walletAddress },
        { recipientWallet: walletAddress }
      ]
    }).project({
      senderWallet: 1,
      recipientWallet: 1,
      tokenAmount: 1,
      tokenSymbol: 1,
      customizedLink: 1,
      recipientEmail: 1
    }).toArray();

    if (transactions.length === 0) {
      return res.status(404).json({ error: 'No transactions found for this wallet' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
}