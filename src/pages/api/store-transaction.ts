import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import chainConfig from '../../config/chains';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { recipientWallet, senderWallet, tokenAmount, tokenSymbol, recipientEmail, transactionHash, chainId } = req.body;
      console.log('Request body:', { recipientWallet, senderWallet, tokenAmount, tokenSymbol, recipientEmail, transactionHash, chainId });

      if (!recipientWallet || !senderWallet || !tokenAmount || !tokenSymbol || !recipientEmail || !transactionHash || !chainId) {
        console.log('Missing required fields in request');
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Check if the chainId exists in the configuration
      if (!chainConfig[chainId]) {
        console.log(`Invalid chainId: ${chainId}`);
        return res.status(400).json({ error: 'Invalid chainId' });
      }

      const client = await clientPromise;
      const db = client.db('transactionDB');
      const collection = db.collection('transactions');

       // Get the block explorer URL for the given chainId
       const blockExplorerUrl = chainConfig[chainId].blockexplorer;

      // Insert the transaction data
      const result = await collection.insertOne({
        recipientWallet,
        senderWallet,
        tokenAmount,
        tokenSymbol,
        recipientEmail,
        transactionHash,
        chainId,
        createdAt: new Date(),
        customizedLink: `${blockExplorerUrl}/${transactionHash}`,
        authenticated: false 
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