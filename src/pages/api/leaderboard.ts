import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('transactionDB');
      const collection = db.collection('transactions');

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
            uniqueEmails: new Set() 
          });
        }

        const senderInfo = senderData.get(senderWallet);
        
        // Add to invites
        senderInfo.invites.add(recipientWallet);

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
        claims: data.claims.size // No need to cap claims now, as we're only counting authenticated transactions
      })).sort((a, b) => b.claims - a.claims);

      // Take top 10
      const top10 = leaderboardData.slice(0, 10);

      res.status(200).json(top10);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
      res.status(500).json({ error: 'Failed to fetch leaderboard data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}