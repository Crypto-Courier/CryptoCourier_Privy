import { NextApiRequest, NextApiResponse } from 'next';
import { handleError } from '../../utils/api-error-handler';
import { updateTransactionStatus } from '../../controllers/updateTransactionController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow PATCH method
  if (req.method !== 'PATCH') {
    return handleError(res, 405, 'Method Not Allowed');
  }

  try {
    const { 
      transactionHash, 
      authenticate = false, 
      claim = false 
    } = req.body;

    // Validate required fields
    if (!transactionHash) {
      return handleError(res, 400, 'Transaction hash is required');
    }

    // Validate at least one action is requested
    if (!authenticate && !claim) {
      return handleError(res, 400, 'At least one action (authenticate or claim) must be specified');
    }

    // Perform transaction update
    const updatedTransaction = await updateTransactionStatus(transactionHash, {
      authenticate,
      claim
    });

    // Respond with updated transaction details
    res.status(200).json({
      message: 'Transaction updated successfully',
      transaction: {
        transactionHash: updatedTransaction.transactionHash,
        authenticated: updatedTransaction.authenticated,
        authenticatedAt: updatedTransaction.authenticatedAt,
        claimed: updatedTransaction.claimed,
        claimedAt: updatedTransaction.claimedAt
      }
    });
  } catch (error: any) {
    console.error('Transaction update error:', error);

    // Handle specific error types
    switch (error.message) {
      case 'Transaction not found':
        return handleError(res, 404, 'Transaction not found');
      
      case 'Invalid transaction hash':
        return handleError(res, 400, 'Invalid transaction hash');
      
      case 'Transaction already authenticated':
        return handleError(res, 409, 'Transaction already authenticated');
      
      case 'Transaction already claimed':
        return handleError(res, 409, 'Transaction already claimed');
      
      default:
        handleError(res, 500, 'Failed to update transaction');
    }
  }
}