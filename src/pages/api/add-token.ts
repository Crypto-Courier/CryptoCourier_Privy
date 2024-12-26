import { NextApiRequest, NextApiResponse } from 'next';
import { createToken } from '../../controllers/tokenController'
import dbConnect from '../../lib/dbConnect';
import { privyAuthMiddleware } from '../../middleware/privyAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure database connection
    await dbConnect();

    // Create token
    const newToken = await createToken(req.body);
    res.status(201).json(newToken);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ error: errorMessage });
  }
}

export default privyAuthMiddleware(handler);