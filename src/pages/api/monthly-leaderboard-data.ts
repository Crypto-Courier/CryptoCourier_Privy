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
    const { activeAddress, chainId, month } = req.query;

    // Parse selected month or use current month
    let targetDate: Date;
    if (month) {
      const [monthStr, yearStr] = (month as string).split('/');
      targetDate = new Date(parseInt(yearStr), parseInt(monthStr) - 1);
    } else {
      targetDate = new Date();
    }

    const targetMonthYear = `${(targetDate.getMonth() + 1).toString().padStart(2, '0')}/${targetDate.getFullYear()}`;
    const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59, 999);

    console.log("For which month data is fetching for monthly leaderboard", targetMonthYear, startOfMonth, endOfMonth);

    const transactionsCollection = await getTransactionCollection();
    const leaderboardPointsCollection = await getLeaderboardPointsCollection();

    // Build query for transactions based on chainId and date filters
    const transactionQuery: any = {
      $and: [
        chainId ? { chainId: chainId.toString() } : {},
        {
          $or: [
            {
              transactedAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
              }
            },
            {
              authenticatedAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
              }
            }
          ]
        }
      ]
    };

    // Fetch filtered transactions
    const transactions = await transactionsCollection.find(transactionQuery);

    // Fetch all leaderboard points with monthly data
    const leaderboardPoints = await leaderboardPointsCollection.find({
      'monthlyPoints.month': targetMonthYear
    });

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

    // Process transactions
    transactions.forEach((transaction: any) => {
      const {
        gifterWallet,
        claimerWallet,
        claimerEmail,
        authenticated,
        chainId: txChainId,
        transactedAt,
        authenticatedAt
      } = transaction;

      const normalizedGifterWallet = gifterWallet.toLowerCase();
      const senderInfo = senderData.get(normalizedGifterWallet)!;

      // Track invites and claims only if chain matches or no chain filter
      if (!chainId || txChainId === chainId) {
        // Check if transaction is relevant for this month based on transactedAt or authenticatedAt
        const txDate = new Date(transactedAt);
        const authDate = authenticated ? new Date(authenticatedAt) : null;

        const isTransactionInMonth = txDate >= startOfMonth && txDate <= endOfMonth;
        const isAuthenticationInMonth = authDate && authDate >= startOfMonth && authDate <= endOfMonth;

        if (isTransactionInMonth || isAuthenticationInMonth) {
          if (claimerWallet &&
            !senderInfo.transactions.some(t => t.claimerWallet === claimerWallet.toLowerCase())) {
            senderInfo.invites++;
          }

          if (claimerEmail &&
            authenticated &&
            !senderInfo.transactions.some(t => t.claimerEmail === claimerEmail)) {
            senderInfo.claims++;
          }

          senderInfo.transactions.push({ ...transaction, gifterWallet: normalizedGifterWallet });
        }
      }
    });

    // Process monthly points with chain filtering
    leaderboardPoints.forEach((pointEntry: any) => {
      const wallet = pointEntry.gifterWallet.toLowerCase();
      const matchingWallet = Array.from(senderData.keys()).find(
        key => key.toLowerCase() === wallet
      );

      if (matchingWallet) {
        const senderInfo = senderData.get(matchingWallet)!;
        const monthlyData = pointEntry.monthlyPoints.find(
          (mp: any) => mp.month === targetMonthYear
        );

        if (monthlyData) {
          // Filter points based on chainId
          const pointsByChain: PointEntry[] = monthlyData.points
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
      message: `Monthly leaderboard data for ${targetMonthYear} retrieved successfully`,
      allUsers: leaderboardData,
      totalUsers: leaderboardData.length,
      topThreeUsers: leaderboardData.slice(0, 3),
      month: targetMonthYear
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
    console.error("Error fetching monthly leaderboard data:", error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch monthly leaderboard data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}