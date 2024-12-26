import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '../../utils/api-error-handler';
import { validateTransactionInput, createTransaction } from '../../controllers/transactionController';
import { privyAuthMiddleware } from '../../middleware/privyAuth';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return handleError(res, 405, 'Method Not Allowed');
  }

  try {
    const {
      claimerWallet,
      gifterWallet,
      tokenAmount,
      tokenSymbol,
      claimerEmail,
      gifterEmail,
      chainId,
      transactionHash
    } = req.body;

    // Perform input validation
    const errors = validateTransactionInput(req.body);
    if (errors.length > 0) {
      return handleError(res, 400, errors.join(', '));
    }

    // Create transaction
    const savedTransaction = await createTransaction({
      claimerWallet,
      gifterWallet,
      tokenAmount,
      tokenSymbol,
      claimerEmail,
      gifterEmail,
      chainId,
      transactionHash,
      authenticated: false,
      claimed: false,
      transactedAt: Date()
    });

    res.status(201).json({
      message: 'Transaction stored successfully',
      transactionId: savedTransaction._id.toString(),
      transactionHash
    });
  } catch (error: any) {
    console.error('Failed to store transaction', error);
    if (error.message === 'Transaction with this hash already exists') {
      return handleError(res, 409, error.message);
    }
    handleError(res, 500, 'Failed to store transaction');
  }
}

export default privyAuthMiddleware(handler);

