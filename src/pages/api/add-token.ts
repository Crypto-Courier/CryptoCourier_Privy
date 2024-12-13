import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/dbConnect'; // Assuming dbConnect is your updated MongoDB connection file
import { AddToken } from '../../types/add-token-form-types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      error: `Method ${req.method} Not Allowed`,
      details: 'This endpoint only accepts POST requests.',
    });
  }

  try {
    const newToken = req.body as AddToken;

    // Validate token data
    const validationError = validateTokenData(newToken);
    if (validationError) {
      return res.status(400).json({ error: 'Invalid token data', details: validationError });
    }

    const client = await clientPromise();
    const db = client.db('tokenDatabase');

    // Ensure chainId is stored as a number
    const formattedToken = {
      ...newToken,
      chainId: Number(newToken.chainId),
      decimals: Number(newToken.decimals),
    };

    // Check for existing token conflicts
    const existingToken = await db.collection('tokens').findOne({
      $or: [
        { contractAddress: formattedToken.contractAddress },
        { symbol: formattedToken.symbol },
      ],
    });

    if (existingToken) {
      const conflictDetails =
        existingToken.contractAddress === formattedToken.contractAddress
          ? 'Contract address already exists'
          : 'Symbol already exists';
      return res.status(409).json({
        error: 'Token already exists',
        details: conflictDetails,
      });
    }

    // Insert new token into the database
    const result = await db.collection('tokens').insertOne(formattedToken);

    res.status(200).json({ message: 'Token added successfully', result });
  } catch (error) {
    console.error('Unexpected error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    res.status(500).json({ error: 'Failed to add token', details: errorMessage });
  }
}

function validateTokenData(token: AddToken): string | null {
  if (!token.contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(token.contractAddress)) {
    return 'Contract address is invalid';
  }
  if (!token.symbol || typeof token.symbol !== 'string') {
    return 'Symbol is required and must be a string';
  }
  if (!token.name || typeof token.name !== 'string') {
    return 'Name is required and must be a string';
  }
  if (!token.chainId || isNaN(Number(token.chainId))) {
    return 'Chain ID is required and must be a valid number';
  }
  if (!token.decimals || isNaN(Number(token.decimals))) {
    return 'Decimals must be a valid number';
  }
  return null;
}
