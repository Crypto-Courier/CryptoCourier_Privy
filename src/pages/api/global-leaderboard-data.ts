import { NextApiRequest, NextApiResponse } from 'next';
import {
  getLeaderboardPointsCollection,
  getTransactionCollection
} from '../../lib/getCollections';
import { LeaderboardEntry, LeaderboardResponse, PointEntry } from '../../types/leaderboard-types';

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
    const { activeAddress, chainId } = req.query;

    const transactionsCollection = await getTransactionCollection();
    const leaderboardPointsCollection = await getLeaderboardPointsCollection();

    // Build query for transactions based on chainId
    const transactionQuery = chainId ? { chainId: chainId.toString() } : {};

    // Fetch filtered transactions
    const transactions = await transactionsCollection.find(transactionQuery);

    // Fetch all leaderboard points
    const leaderboardPoints = await leaderboardPointsCollection.find({});

    // Get all unique addresses from both transactions and points
    const uniqueAddresses = new Set<string>();
    transactions.forEach((tx: any) => uniqueAddresses.add(tx.gifterWallet.toLowerCase()));
    leaderboardPoints.forEach((point: any) => uniqueAddresses.add(point.gifterWallet.toLowerCase()));

    // Process the data
    const senderData = new Map<string, LeaderboardEntry>();

    // Initialize entries for all unique addresses
    uniqueAddresses.forEach(address => {
      senderData.set(address, {
        address,
        invites: 0,
        claims: 0,
        transactions: [],
        points: { total: 0, byChain: [] },
        rank: 0
      });
    });

    // Process transactions with chain filtering
    transactions.forEach((transaction: any) => {
      const {
        gifterWallet,
        claimerWallet,
        claimerEmail,
        authenticated,
        chainId: txChainId
      } = transaction;

      const normalizedGifterWallet = gifterWallet.toLowerCase();
      const senderInfo = senderData.get(normalizedGifterWallet)!;

      // Track invites and claims only if chain matches or no chain filter
      if ((!chainId || txChainId === chainId)) {
        if (claimerWallet &&
          !senderInfo.transactions.some(t => t.claimerWallet === claimerWallet.toLowerCase())) {
          senderInfo.invites++;
        }

        if (claimerEmail &&
          authenticated &&
          !senderInfo.transactions.some(t => t.claimerEmail === claimerEmail)) {
          senderInfo.claims++;
        }

        senderInfo.transactions.push({...transaction, gifterWallet: normalizedGifterWallet});
      }
    });

    // Process points with chain filtering
    leaderboardPoints.forEach((pointEntry: any) => {
      const wallet = pointEntry.gifterWallet.toLowerCase();
      const matchingWallet = Array.from(senderData.keys()).find(
        key => key.toLowerCase() === wallet
      );

      if (matchingWallet) {
        const senderInfo = senderData.get(matchingWallet)!;

        // Filter points based on chainId
        const pointsByChain: PointEntry[] = pointEntry.points
          .filter((point: any) => !chainId || point.chainId === chainId)
          .map((point: any) => ({
            chain: point.chainId,
            points: typeof point.points === 'number' ? point.points : 0
          }));

        // If chain is selected but user has no points for that chain,
        // add an entry with 0 points
        if (chainId && !pointsByChain.some(p => p.chainId === chainId)) {
          pointsByChain.push({
            chainId: chainId.toString(),
            points: 0
          });
        }

        const totalPoints = pointsByChain.reduce((sum, point) => sum + point.points, 0);

        senderInfo.points = {
          total: totalPoints,
          byChain: pointsByChain
        };
      }
    });

    // Convert to array and sort
    const leaderboardData = Array.from(senderData.values())
      .sort((a, b) => {
        const pointsDiff = (b.points?.total || 0) - (a.points?.total || 0);
        return pointsDiff !== 0 ? pointsDiff : b.claims - a.claims;
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1
      }));

    const response: LeaderboardResponse = {
      status: 'success',
      message: 'Leaderboard data retrieved successfully',
      allUsers: leaderboardData,
      totalUsers: leaderboardData.length,
      topThreeUsers: leaderboardData.slice(0, 3)
    };

    // Add user-specific data if requested
    if (activeAddress) {
      const normalizedActiveAddress = (activeAddress as string).toLowerCase();
      const userSpecificData = leaderboardData.find(
        user => user.address.toLowerCase() === normalizedActiveAddress
      );

      if (userSpecificData) {
        response.userDetails = userSpecificData;
        response.userRank = userSpecificData.rank;
      } else {
        // Add default user data if address exists but has no activity
        response.userDetails = {
          address: activeAddress as string,
          invites: 0,
          claims: 0,
          transactions: [],
          points: { total: 0, byChain: chainId ? [{ chainId: chainId.toString(), points: 0 }] : [] },
          rank: leaderboardData.length + 1
        };
        response.userRank = leaderboardData.length + 1;
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
