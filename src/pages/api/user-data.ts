import type { NextApiRequest, NextApiResponse } from 'next';
import { userDataByTransactionHash } from '../../controllers/userController';
import mongoose from 'mongoose';
import { privyAuthMiddleware } from '../../middleware/privyAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) : Promise<void>  {
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
      const user = await userDataByTransactionHash(transactionHash);

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

      res.status(500).json({
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        // Optionally include more error details for debugging
        ...(error instanceof Error ? { details: error.toString() } : {})
      });

      return;
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }
}

export default privyAuthMiddleware(handler);