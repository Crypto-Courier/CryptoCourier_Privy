import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection } from '../../lib/getCollections';
import { handleError } from '../../utils/api-error-handler';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method for storing transactions
  if (req.method !== 'POST') {
    return handleError(res, 405, 'Method Not Allowed');
  }

  // Get transaction collection
  const transactionCollection = await getTransactionCollection();

  try {
    const {
      recipientWallet,
      senderWallet,
      tokenAmount,
      tokenSymbol,
      recipientEmail,
      chainId,
      senderEmail,
      transactionHash
    } = req.body;

    // Validate required fields
    const requiredFields = [
      'recipientWallet',
      'senderWallet',
      'tokenAmount',
      'tokenSymbol',
      'recipientEmail',
      'chainId',
      'senderEmail',
      'transactionHash'
    ];

    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return handleError(res, 400, 'Missing required fields');
    }

    // Check if transaction hash already exists
    const existingTransaction = await transactionCollection.findOne({
      transactionHash
    });

    if (existingTransaction) {
      return handleError(res, 409, 'Transaction with this hash already exists');
    }

    // Prepare transaction data
    const transactionData = {
      recipientWallet,
      senderWallet,
      tokenAmount,
      tokenSymbol,
      recipientEmail,
      senderEmail,
      chainId,
      transactionHash,
      authenticated: false,
      claimed: false
    };

    // Insert the transaction data
    const transactionResult = await transactionCollection.insertOne(transactionData);

    res.status(201).json({
      message: 'Transaction stored successfully',
      transactionId: transactionResult.insertedId.toString(),
      transactionHash
    });

  } catch (error) {
    console.error('Failed to store transaction', error);
    handleError(res, 500, 'Failed to store transaction');
  }
}