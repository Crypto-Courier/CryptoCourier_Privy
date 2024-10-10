import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const newToken = req.body;

      if (!newToken.contractAddress || !newToken.symbol || !newToken.name || isNaN(Number(newToken.decimals))) {
        console.error('Invalid token data received:', newToken);
        return res.status(400).json({ error: 'Invalid token data' });
      }

      const client = await clientPromise;
      const db = client.db('tokenDatabase');

      // Check if the token already exists in the database
      const existingToken = await db.collection('tokens').findOne({
        $or: [
          { contractAddress: newToken.contractAddress },
          { symbol: newToken.symbol }
        ]
      });

      if (existingToken) {
        return res.status(409).json({ message: 'Token already exists.' });
      }

      // If the token doesn't exist, add it to the database
      const result = await db.collection('tokens').insertOne(newToken);

      res.status(200).json({ message: 'Token added successfully', result });
    } catch (error) {
      console.error('Error adding token:', error);
      res.status(500).json({ error: 'Failed to add token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}