import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipientWallet, senderWallet, tokenAmount, tokenSymbol, recipientEmail, transactionHash } = req.body;

      if (!recipientWallet || !senderWallet || !tokenAmount || !tokenSymbol || !recipientEmail || !transactionHash) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const client = await clientPromise;
      const db = client.db('transactionDB');
      const collection = db.collection('transactions');

      // Insert the transaction data
      const result = await collection.insertOne({
        recipientWallet,
        senderWallet,
        tokenAmount,
        tokenSymbol,
        recipientEmail,
        transactionHash,
        createdAt: new Date(),
        customizedLink: `https://testnet.bttcscan.com/tx/${transactionHash}`,
        authenticated: false
      });

      res.status(200).json({ message: 'Transaction stored successfully', transactionId: result.insertedId });
    } catch (error) {
      console.error('Error storing transaction:', error);
      res.status(500).json({ error: 'Failed to store transaction' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
