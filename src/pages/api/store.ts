import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '../../utils/api-error-handler';
import { validateUserInput, createUser } from '../../controllers/userController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return handleError(res, 405, 'Method Not Allowed');
  }

  try {
    const {
      claimerWallet,
      claimerEmail,
      authData
    } = req.body;

    // Prepare user input object
    const userInput = {
      claimerWallet,
      claimerEmail,
      authData: authData || {}  // Optional authData
    };

    // Perform input validation
    const errors = validateUserInput(userInput);
    if (errors.length > 0) {
      return handleError(res, 400, errors.join(', '));
    }

    // Create user
    const savedUser = await createUser(userInput);

    res.status(201).json({
      message: 'User stored successfully',
      userId: savedUser._id.toString(),
      claimerWallet: savedUser.claimerWallet
    });
  } catch (error: any) {
    console.error('Failed to store user', error);
    if (error.message.includes('already exists')) {
      return handleError(res, 409, error.message);
    }
    handleError(res, 500, 'Failed to store user');
  }
}