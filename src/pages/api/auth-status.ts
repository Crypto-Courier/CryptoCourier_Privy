import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { walletAddress, authenticated } = req.body;

      if (!walletAddress || typeof authenticated !== 'boolean') {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const client = await clientPromise;
      const db = client.db('transactionDB');
      const collection = db.collection('transactions');

      // Update the authentication status for all transactions with the given wallet address
      const result = await collection.updateMany(
        { recipientWallet: walletAddress },
        { $set: { authenticated: authenticated } }
      );

      res.status(200).json({ message: 'Authentication status updated successfully', modifiedCount: result.modifiedCount });
    } catch (error) {
      console.error('Error updating authentication status:', error);
      res.status(500).json({ error: 'Failed to update authentication status' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}