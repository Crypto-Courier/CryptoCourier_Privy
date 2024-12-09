import { NextApiRequest, NextApiResponse } from 'next';
import { getTransactionCollection, getAuthCollection } from '../../lib/getCollections';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
        console.log('Missing required fields:', missingFields);
        return res.status(400).json({ 
          error: 'Missing required fields', 
          missingFields 
        });
      }

      // Get collections
      const transactionCollection = await getTransactionCollection();
      const authCollection = await getAuthCollection();

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
        authenticated: false,
        claimed: false
      });

      // Check if recipient wallet exists in authentication database
      const recipientAuthData = await authCollection.findOne({ 
        walletAddress: recipientWallet 
      });

      // If recipient exists and not already authenticated
      if (recipientAuthData && !recipientAuthData.authStatus) {
        // Update recipient's authentication status
        await authCollection.updateOne(
          { walletAddress: recipientWallet },
          { 
            $set: { 
              authStatus: true,
              authenticatedAt: new Date() 
            } 
          }
        );
      }

      // Update sender's invited users
      const senderAuthData = await authCollection.findOne({
        walletAddress: senderWallet
      });

      if (senderAuthData) {
        // Check if recipient is already authenticated
        const recipientAlreadyAuthenticated = await authCollection.findOne({
          walletAddress: recipientWallet,
          authStatus: true
        });

        // Update only if recipient is not already authenticated
        if (!recipientAlreadyAuthenticated) {
          await authCollection.updateOne(
            { walletAddress: senderWallet },
            { 
              $push: { invitedUsers: recipientWallet },
              $inc: { numberOfInvitedUsers: 1 }
            }
          );
        }
      }

      console.log('Transaction stored successfully', { 
        transactionId: transactionResult.insertedId 
      });

      res.status(200).json({ 
        message: 'Transaction stored successfully', 
        transactionId: transactionResult.insertedId 
      });

    } catch (error) {
      console.error('Failed to store transaction', error);
      res.status(500).json({ 
        error: 'Failed to store transaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}