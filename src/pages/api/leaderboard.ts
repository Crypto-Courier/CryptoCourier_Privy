import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('transactionDB');
      const collection = db.collection('transactions');

      // Extract query parameters
      const { activeAddress } = req.query;

      // Fetch all transactions
      const transactions = await collection.find({}).toArray();

      // Process the data
      const senderData = new Map();

      transactions.forEach(transaction => {
        const { senderWallet, recipientWallet, recipientEmail, authenticated } = transaction;
        
        if (!senderData.has(senderWallet)) {
          senderData.set(senderWallet, { 
            invites: new Set(), 
            claims: new Set(), 
            uniqueEmails: new Set(),
            transactions: [] 
          });
        }

        const senderInfo = senderData.get(senderWallet);
        
        // Add to invites
        senderInfo.invites.add(recipientWallet);
        senderInfo.transactions.push(transaction);

        // Only count claim if the email is unique and the transaction is authenticated
        if (recipientEmail && authenticated && !senderInfo.uniqueEmails.has(recipientEmail)) {
          senderInfo.uniqueEmails.add(recipientEmail);
          senderInfo.claims.add(recipientEmail);
        }
      });

      // Convert to array and calculate final counts
      const leaderboardData = Array.from(senderData, ([address, data]) => ({
        address,
        invites: data.invites.size,
        claims: data.claims.size,
        transactions: data.transactions
      })).sort((a, b) => b.claims - a.claims);

      // Prepare response
      const response: any = {
        allUsers: leaderboardData, // All users data
        totalUsers: leaderboardData.length,
        topThreeUsers: leaderboardData.slice(0, 3) // Add top 3 users
      };

      // If activeAddress is provided, get specific data for that address
      if (activeAddress) {
        const userSpecificData = leaderboardData.find(user => 
          user.address.toLowerCase() === (activeAddress as string).toLowerCase()
        );

        if (userSpecificData) {
          response.userRank = leaderboardData.findIndex(user => 
            user.address.toLowerCase() === (activeAddress as string).toLowerCase()
          ) + 1;
          response.userDetails = userSpecificData;
        }
      }

      res.status(200).json(response);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}