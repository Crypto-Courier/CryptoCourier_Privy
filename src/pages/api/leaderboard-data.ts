import { NextApiRequest, NextApiResponse } from 'next';
import { getLeaderboardPointsCollection } from '../../lib/getCollections'; // Adjust path as needed

// Types for Leaderboard API
export interface PointsEntry {
    chain: string;
    points: number;
  }
  
  export interface LeaderboardEntry {
    gifterWallet: string;
    points: PointsEntry[];
    totalPoints: number;
  }
  
  export interface LeaderboardApiResponse {
    message: string;
    data: LeaderboardEntry[];
    error?: string;
  }
  
// Type definitions for better type safety
interface LeaderboardPointsEntry {
  gifterWallet: string;
  points: {
    chain: string;
    points: number;
  }[];
}

interface LeaderboardQueryParams {
  chainId?: string;
  wallet?: string;
}

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Extract query parameters
    const { chainId, wallet } = req.query as LeaderboardQueryParams;

    // Ensure collections are properly connected
    const LeaderboardPointsModel = await getLeaderboardPointsCollection();

    // Base query object
    let query: any = {};

    // Construct query based on provided parameters
    if (wallet) {
      query.gifterWallet = wallet.toLowerCase();
    }

    // Aggregation pipeline for flexible querying
    const pipeline: any[] = [
      { $match: query },
      {
        $project: {
          gifterWallet: 1,
          points: 1,
          totalPoints: { $sum: '$points.points' }
        }
      }
    ];

    // If chainId is provided, filter points for specific chain
    if (chainId) {
      pipeline.push({
        $addFields: {
          points: {
            $filter: {
              input: '$points',
              as: 'point',
              cond: { $eq: ['$$point.chain', chainId.toLowerCase()] }
            }
          }
        }
      });
    }

    // Sort by total points in descending order
    pipeline.push({ $sort: { totalPoints: -1 } });

    // Execute aggregation
    const leaderboardData = await LeaderboardPointsModel.aggregate(pipeline);

    // If no wallet specified, return all users
    // If wallet specified but no data found, return empty array
    if (leaderboardData.length === 0) {
      return res.status(200).json({ 
        message: wallet 
          ? 'No leaderboard data found for the specified wallet' 
          : 'No leaderboard data available',
        data: [] 
      });
    }

    // Transform data to include total points for each entry
    const formattedData = leaderboardData.map(entry => ({
      gifterWallet: entry.gifterWallet,
      points: entry.points,
      totalPoints: entry.totalPoints
    }));

    return res.status(200).json({
      message: 'Leaderboard data retrieved successfully',
      data: formattedData
    });

  } catch (error) {
    console.error('Leaderboard retrieval error:', error);
    return res.status(500).json({ 
      message: 'Error retrieving leaderboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}