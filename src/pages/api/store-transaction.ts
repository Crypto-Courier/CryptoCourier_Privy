import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection, getAuthCollection } from '../../lib/getCollections';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Get collections
  const transactionCollection = await getTransactionCollection();
  const authCollection = await getAuthCollection();

  if (req.method === 'POST') {
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

      // Insert the transaction data
      const transactionResult = await transactionCollection.insertOne({
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
      });

      res.status(200).json({ 
        message: 'Transaction stored successfully', 
        transactionId: transactionResult.insertedId,
        transactionHash
      });

    } catch (error) {
      console.error('Failed to store transaction', error);
      res.status(500).json({ 
        error: 'Failed to store transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'PUT') {
    try {
      const { transactionHash } = req.body;

      // Validate transaction hash
      if (!transactionHash) {
        return res.status(400).json({ 
          error: 'Transaction hash is required' 
        });
      }

      // Find the transaction by hash
      const transaction = await transactionCollection.findOne({ 
        transactionHash 
      });

      // Check if transaction exists
      if (!transaction) {
        return res.status(404).json({ 
          error: 'Transaction not found' 
        });
      }

      // Check if transaction is already authenticated and claimed
      if (transaction.authenticated && transaction.claimed) {
        return res.status(400).json({ 
          error: 'Transaction already authenticated and claimed' 
        });
      }

      // Recipient Authentication Logic
      const recipientAuthData = await authCollection.findOne({ 
        walletAddress: transaction.recipientWallet 
      });

      // Update recipient's authentication status if not already authenticated
      if (!recipientAuthData || !recipientAuthData.authStatus) {
        await authCollection.updateOne(
          { walletAddress: transaction.recipientWallet },
          { 
            $set: { 
              walletAddress: transaction.recipientWallet,
              email: transaction.recipientEmail,
              authStatus: true,
              authenticatedAt: new Date() 
            }
          },
          { upsert: true }
        );
      }

      // Check if recipient is already authenticated
      const isRecipientAuthenticated = await authCollection.findOne({
        walletAddress: transaction.recipientWallet,
        authStatus: true
      });

      // Sender Invited Users Logic
      // Update sender's invited users only if recipient is not already authenticated
      if (!isRecipientAuthenticated) {
        await authCollection.updateOne(
          { 
            walletAddress: transaction.senderWallet 
          },
          { 
            $set: { 
              walletAddress: transaction.senderWallet,
              email: transaction.senderEmail
            },
            $addToSet: { invitedUsers: transaction.recipientWallet },
            $inc: { numberOfInvitedUsers: 1 }
          },
          { upsert: true }
        );
      }

      // Update transaction status
      await transactionCollection.updateOne(
        { transactionHash },
        { 
          $set: {
            authenticated: true,
            claimed: true,
            authenticatedAt: new Date()
          }
        }
      );

      res.status(200).json({ 
        message: 'Transaction authenticated and processed successfully',
        transactionHash,
        recipientWallet: transaction.recipientWallet,
        senderWallet: transaction.senderWallet
      });

    } catch (error) {
      console.error('Failed to process transaction', error);
      res.status(500).json({ 
        error: 'Failed to process transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', ['POST', 'PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}