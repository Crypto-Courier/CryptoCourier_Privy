import type { NextApiRequest, NextApiResponse } from 'next';
import { authenticateUserByTransactionHash } from '../../controllers/userController'; // Adjust import path as needed

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
      console.error('Authentication error:', error);
      return res.status(500).json({ 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      });
    }
  } else {
    // Handle unsupported HTTP methods
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}