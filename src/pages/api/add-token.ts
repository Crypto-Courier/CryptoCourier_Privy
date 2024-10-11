import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import { NewToken } from '../../types/types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed`, details: 'This endpoint only accepts POST requests.' });
  }

  try {
    const newToken = req.body as NewToken;

    // Validate token data
    const validationError = validateTokenData(newToken);
    if (validationError) {
      console.error('Token data validation failed:', validationError);
      return res.status(400).json({ error: 'Invalid token data', details: validationError });
    }

    const client = await clientPromise;
    const db = client.db('tokenDatabase');

    // Check if the token already exists
    const existingToken = await db.collection('tokens').findOne({
      $or: [
        { contractAddress: newToken.contractAddress },
        { symbol: newToken.symbol }
      ]
    });

    if (existingToken) {
      const conflictDetails = existingToken.contractAddress === newToken.contractAddress
        ? 'Contract address already exists'
        : 'Symbol already exists';
      return res.status(409).json({ error: 'Token already exists', details: conflictDetails });
    }

    // Add the token to the database
    const result = await db.collection('tokens').insertOne(newToken);

    res.status(200).json({ message: 'Token added successfully', result });
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to add token', details: errorMessage });
  }
}

function validateTokenData(token: NewToken): string | null {
  if (!token.contractAddress) return 'Contract address is required';
  if (!token.symbol) return 'Symbol is required';
  if (!token.name) return 'Name is required';
  if (isNaN(Number(token.decimals))) return 'Decimals must be a valid number';
  return null;
}