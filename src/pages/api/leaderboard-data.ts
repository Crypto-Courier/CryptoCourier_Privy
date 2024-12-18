// import { NextApiRequest, NextApiResponse } from 'next';
// import { getLeaderboardPointsCollection } from '../../lib/getCollections'; // Adjust path as needed

// // Types for Leaderboard API
// export interface PointsEntry {
//     chain: string;
//     points: number;
//   }
  
//   export interface LeaderboardEntry {
//     gifterWallet: string;
//     points: PointsEntry[];
//     totalPoints: number;
//   }
  
//   export interface LeaderboardApiResponse {
//     message: string;
//     data: LeaderboardEntry[];
//     error?: string;
//   }
  
// // Type definitions for better type safety
// interface LeaderboardPointsEntry {
//   gifterWallet: string;
//   points: {
//     chain: string;
//     points: number;
//   }[];
// }

// interface LeaderboardQueryParams {
//   chainId?: string;
//   wallet?: string;
// }

// export default async function handler(
//   req: NextApiRequest, 
//   res: NextApiResponse
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Method Not Allowed' });
//   }

//   try {
//     // Extract query parameters
//     const { chainId, wallet } = req.query as LeaderboardQueryParams;

//     // Ensure collections are properly connected
//     const LeaderboardPointsModel = await getLeaderboardPointsCollection();

//     // Base query object
//     let query: any = {};

//     // Construct query based on provided parameters
//     if (wallet) {
//       query.gifterWallet = wallet.toLowerCase();
//     }

//     // Aggregation pipeline for flexible querying
//     const pipeline: any[] = [
//       { $match: query },
//       {
//         $project: {
//           gifterWallet: 1,
//           points: 1,
//           totalPoints: { $sum: '$points.points' }
//         }
//       }
//     ];

//     // If chainId is provided, filter points for specific chain
//     if (chainId) {
//       pipeline.push({
//         $addFields: {
//           points: {
//             $filter: {
//               input: '$points',
//               as: 'point',
//               cond: { $eq: ['$$point.chain', chainId.toLowerCase()] }
//             }
//           }
//         }
//       });
//     }

//     // Sort by total points in descending order
//     pipeline.push({ $sort: { totalPoints: -1 } });

//     // Execute aggregation
//     const leaderboardData = await LeaderboardPointsModel.aggregate(pipeline);

//     // If no wallet specified, return all users
//     // If wallet specified but no data found, return empty array
//     if (leaderboardData.length === 0) {
//       return res.status(200).json({ 
//         message: wallet 
//           ? 'No leaderboard data found for the specified wallet' 
//           : 'No leaderboard data available',
//         data: [] 
//       });
//     }

//     // Transform data to include total points for each entry
//     const formattedData = leaderboardData.map(entry => ({
//       gifterWallet: entry.gifterWallet,
//       points: entry.points,
//       totalPoints: entry.totalPoints
//     }));

//     return res.status(200).json({
//       message: 'Leaderboard data retrieved successfully',
//       data: formattedData
//     });

//   } catch (error) {
//     console.error('Leaderboard retrieval error:', error);
//     return res.status(500).json({ 
//       message: 'Error retrieving leaderboard data',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// }


// import { NextApiRequest, NextApiResponse } from 'next';
// import { getLeaderboardPointsCollection, getTransactionCollection } from '../../lib/getCollections';
// import { LeaderboardEntry, LeaderboardResponse } from '../../types/leaderboard-types'

// export default async function handler(
//   req: NextApiRequest, 
//   res: NextApiResponse<LeaderboardResponse>
// ) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ 
//       status: 'error',
//       message: 'Method Not Allowed',
//       error: 'Only GET method is supported'
//     });
//   }

//   try {
//     // Extract query parameters
//     const { activeAddress } = req.query;

//     // Get collections
//     const transactionsCollection = await getTransactionCollection();
//     const leaderboardCollection = await getLeaderboardPointsCollection();

//     // Fetch all transactions
//     const transactions = await transactionsCollection.find({});

//     // Process the data
//     const senderData = new Map<string, LeaderboardEntry>();

//     transactions.forEach((transaction: any) => {
//       const { gifterWallet, claimerWallet, claimerEmail, authenticated } = transaction;

//       // Ensure gifter wallet exists in the map
//       if (!senderData.has(gifterWallet)) {
//         senderData.set(gifterWallet, {
//           address: gifterWallet,
//           invites: 0,
//           claims: 0,
//           transactions: [],
//         });
//       }

//       const senderInfo = senderData.get(gifterWallet)!;

//       // Track invites
//       if (claimerWallet && !senderInfo.transactions.some(t => t.claimerWallet === claimerWallet)) {
//         senderInfo.invites++;
//       }

//       // Track claims (only unique, authenticated emails)
//       if (
//         claimerEmail && 
//         authenticated && 
//         !senderInfo.transactions.some(t => t.claimerEmail === claimerEmail)
//       ) {
//         senderInfo.claims++;
//       }

//       senderInfo.transactions.push(transaction);
//     });

//     // Convert to array and sort
//     const leaderboardData = Array.from(senderData.values())
//       .sort((a, b) => b.claims - a.claims)
//       .map((entry, index) => ({
//         ...entry,
//         rank: index + 1
//       }));

//     // Prepare response
//     const response: LeaderboardResponse = {
//       status: 'success',
//       message: 'Leaderboard data retrieved successfully',
//       allUsers: leaderboardData,
//       totalUsers: leaderboardData.length,
//       topThreeUsers: leaderboardData.slice(0, 3)
//     };

//     // If active address is provided, get specific data
//     if (activeAddress) {
//       const userSpecificData = leaderboardData.find(
//         user => user.address.toLowerCase() === (activeAddress as string).toLowerCase()
//       );

//       if (userSpecificData) {
//         response.userDetails = userSpecificData;
//         response.userRank = userSpecificData.rank;
//       }
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.error("Error fetching leaderboard data:", error);
//     res.status(500).json({ 
//       status: 'error',
//       message: 'Failed to fetch leaderboard data',
//       error: error instanceof Error ? error.message : 'Unknown error'
//     });
//   }
// }

import { NextApiRequest, NextApiResponse } from 'next';
import { 
  getLeaderboardPointsCollection, 
  getTransactionCollection 
} from '../../lib/getCollections';
import { LeaderboardEntry, LeaderboardResponse, PointsEntry } from '@/types/leaderboard-types';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<LeaderboardResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: 'error',
      message: 'Method Not Allowed',
      error: 'Only GET method is supported'
    });
  }

  try {
    // Extract query parameters
    const { activeAddress } = req.query;

    // Get collections
    const transactionsCollection = await getTransactionCollection();
    const leaderboardPointsCollection = await getLeaderboardPointsCollection();

    // Fetch all transactions
    const transactions = await transactionsCollection.find({});

    // Fetch leaderboard points
    const leaderboardPoints = await leaderboardPointsCollection.find({});

    // Process the data
    const senderData = new Map<string, LeaderboardEntry>();

    transactions.forEach((transaction: any) => {
      const { gifterWallet, claimerWallet, claimerEmail, authenticated } = transaction;

      // Ensure gifter wallet exists in the map
      if (!senderData.has(gifterWallet)) {
        senderData.set(gifterWallet, {
          address: gifterWallet,
          invites: 0,
          claims: 0,
          transactions: [],
          points: { total: 0, byChain: [] }
        });
      }

      const senderInfo = senderData.get(gifterWallet)!;

      // Track invites
      if (claimerWallet && !senderInfo.transactions.some(t => t.claimerWallet === claimerWallet)) {
        senderInfo.invites++;
      }

      // Track claims (only unique, authenticated emails)
      if (
        claimerEmail && 
        authenticated && 
        !senderInfo.transactions.some(t => t.claimerEmail === claimerEmail)
      ) {
        senderInfo.claims++;
      }

      senderInfo.transactions.push(transaction);
    });

    // Add points from LeaderboardPoints collection
    leaderboardPoints.forEach((pointEntry: any) => {
      const wallet = pointEntry.gifterWallet;
      if (senderData.has(wallet)) {
        const senderInfo = senderData.get(wallet)!;
        
        // Calculate total points
        const totalPoints = pointEntry.points.reduce((sum: number, chainPoint: PointsEntry) => 
          sum + chainPoint.points, 0);
        
        senderInfo.points = {
          total: totalPoints,
          byChain: pointEntry.points
        };
      }
    });

    // Convert to array and sort (prioritize points, then claims)
    const leaderboardData = Array.from(senderData.values())
      .sort((a, b) => {
        // Sort by total points, then by claims
        const pointsDiff = (b.points?.total || 0) - (a.points?.total || 0);
        return pointsDiff !== 0 ? pointsDiff : b.claims - a.claims;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    // Prepare response
    const response: LeaderboardResponse = {
      status: 'success',
      message: 'Leaderboard data retrieved successfully',
      allUsers: leaderboardData,
      totalUsers: leaderboardData.length,
      topThreeUsers: leaderboardData.slice(0, 3)
    };

    // If active address is provided, get specific data
    if (activeAddress) {
      const userSpecificData = leaderboardData.find(
        user => user.address.toLowerCase() === (activeAddress as string).toLowerCase()
      );

      if (userSpecificData) {
        response.userDetails = userSpecificData;
        response.userRank = userSpecificData.rank;
      }
    }

    console.log("What is the response of leaderboard?", response);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch leaderboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}