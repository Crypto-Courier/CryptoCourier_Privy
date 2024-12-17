import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUserByTransactionHash } from '../../controllers/userController';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const {
        transactionHash
      } = req.body;

      // Validate input
      if (!transactionHash) {
        return res.status(400).json({
          error: 'Transaction hash is required'
        });
      }

      // Authenticate user based on transaction
      const user = await authenticateUserByTransactionHash(transactionHash);

      // Return the authenticated user
      return res.status(200).json({
        message: 'User authenticated successfully',
        user
      });

    } catch (error) {
      console.error('Full Authentication error:', error);

      // Log more detailed error information
      if (mongoose && error instanceof mongoose.Error.ValidationError) {
        console.error('Validation Errors:', error.errors);
      } else if (error instanceof Error) {
        console.error('An unexpected error occurred:', error.message);
      }

      return res.status(500).json({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        // Optionally include more error details for debugging
        ...(error instanceof Error ? { details: error.toString() } : {})
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}