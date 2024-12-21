import mongoose from 'mongoose';
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
      // Normalize wallet address to lowercase for consistent matching
      const wallet = pointEntry.gifterWallet.toLowerCase();

      // Find the matching wallet in senderData using case-insensitive comparison
      const matchingWallet = Array.from(senderData.keys()).find(
        key => key.toLowerCase() === wallet
      );

      if (matchingWallet) {
        const senderInfo = senderData.get(matchingWallet)!;

        // Calculate total points and prepare points by chain
        const pointsByChain: PointsEntry[] = pointEntry.points.map((point: any) => ({
          chain: point.chain,
          points: point.points instanceof mongoose?.Types.Decimal128
            ? point.points.toNumber()
            : point.points
        }));

        const totalPoints = pointsByChain.reduce((sum, point) => sum + point.points, 0);

        senderInfo.points = {
          total: totalPoints,
          byChain: pointsByChain
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