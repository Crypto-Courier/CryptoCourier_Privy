import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection } from '../../lib/getCollections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST method for storing transactions
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
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
      return res.status(400).json({ 
        error: 'Missing required fields', 
        missingFields 
      });
    }

    // Check if transaction hash already exists
    const existingTransaction = await transactionCollection.findOne({ 
      transactionHash 
    });

    if (existingTransaction) {
      return res.status(409).json({ 
        error: 'Transaction with this hash already exists' 
      });
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
      createdAt: new Date(),
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
    res.status(500).json({ 
      error: 'Failed to store transaction',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}