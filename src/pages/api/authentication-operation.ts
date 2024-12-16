// import { NextApiRequest, NextApiResponse } from 'next';
// import { getTransactionCollection, getAuthCollection } from '../../lib/getCollections';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // Get collections
//   const transactionCollection = await getTransactionCollection();
//   const authCollection = await getAuthCollection();

//   if (req.method === 'PUT') {
//     try {
//       const { transactionHash } = req.body;

//       // Validate transaction hash
//       if (!transactionHash) {
//         return res.status(400).json({ 
//           error: 'Transaction hash is required' 
//         });
//       }

//       // Find the transaction by hash
//       const transaction = await transactionCollection.findOne({ 
//         transactionHash 
//       });

//       // Check if transaction exists
//       if (!transaction) {
//         return res.status(404).json({ 
//           error: 'Transaction not found' 
//         });
//       }

//       // Check if transaction is already claimed
//       if (transaction.claimed) {
//         return res.status(400).json({ 
//           error: 'Transaction already claimed' 
//         });
//       }

//       // Check receiver's authentication status
//       const receiverAuthData = await authCollection.findOne({ 
//         $or: [
//           { walletAddress: transaction.recipientWallet },
//           { email: transaction.recipientEmail }
//         ]
//       });

//       // Variables to track authentication status
//       let isReceiverNewlyAuthenticated = false;
//       let shouldAuthenticate = false;

//       // Determine authentication logic
//       if (!receiverAuthData || receiverAuthData.authStatus !== true) {
//         shouldAuthenticate = true;
        
//         // Update receiver's authentication
//         await authCollection.updateOne(
//           { 
//             $or: [
//               { walletAddress: transaction.recipientWallet },
//               { email: transaction.recipientEmail }
//             ]
//           },
//           { 
//             $set: { 
//               walletAddress: transaction.recipientWallet,
//               email: transaction.recipientEmail,
//               authStatus: true,
//               authenticatedAt: new Date() 
//             }
//           },
//           { upsert: true }
//         );

//         isReceiverNewlyAuthenticated = true;
//       }

//       // Update sender's invited users if receiver is newly authenticated
//       if (isReceiverNewlyAuthenticated) {
//         await authCollection.updateOne(
//           { 
//             walletAddress: transaction.senderWallet 
//           },
//           { 
//             $set: { 
//               walletAddress: transaction.senderWallet,
//               email: transaction.senderEmail
//             },
//             $addToSet: { invitedUsers: transaction.recipientWallet },
//             $inc: { numberOfInvitedUsers: 1 }
//           },
//           { upsert: true }
//         );
//       }

//       // Update transaction status - Always set claimed to true
//       await transactionCollection.updateOne(
//         { transactionHash },
//         { 
//           $set: {
//             authenticated: shouldAuthenticate,
//             claimed: true,
//             authenticatedAt: shouldAuthenticate ? new Date() : undefined
//           }
//         }
//       );

//       res.status(200).json({ 
//         message: 'Transaction processed successfully',
//         transactionHash,
//         recipientWallet: transaction.recipientWallet,
//         senderWallet: transaction.senderWallet,
//         receiverNewlyAuthenticated: isReceiverNewlyAuthenticated,
//         authenticated: shouldAuthenticate
//       });

//     } catch (error) {
//       console.error('Failed to process transaction', error);
//       res.status(500).json({ 
//         error: 'Failed to process transaction',
//         details: error instanceof Error ? error.message : 'Unknown error'
//       });
//     }
//   } else {
//     res.setHeader('Allow', ['PUT']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }