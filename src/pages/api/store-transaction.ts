import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipientWallet, senderWallet, tokenAmount, tokenSymbol, recipientEmail, customizedLink, chainId, senderEmail } = req.body;
      console.log('Request body:', { recipientWallet, senderWallet, tokenAmount, tokenSymbol, recipientEmail, chainId, senderEmail });

      if (!recipientWallet || !senderWallet || !tokenAmount || !tokenSymbol || !recipientEmail || !chainId || !customizedLink ||!senderEmail) {
        console.log('Missing required fields in request');
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
        senderEmail,
        chainId,
        createdAt: new Date(),
        customizedLink,
      });

      console.log('Transaction stored successfully', { transactionId: result.insertedId });
      res.status(200).json({ message: 'Transaction stored successfully', transactionId: result.insertedId });
    } catch (error) {
      console.error('Failed to store transaction', error);
      res.status(500).json({ error: 'Failed to store transaction' });
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}