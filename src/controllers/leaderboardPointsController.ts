import { getLeaderboardPointsCollection } from '../lib/getCollections';
import { PointEntry, LeaderboardPointsData } from '../types/leaderboard-controller-types';

// Create or Modify the leaderboard for gifter
export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: LeaderboardPointsData) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();

  // Normalize wallet address
  const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

  // Ensure points have both chain and chainId
  const processedPoints: PointEntry[] = leaderboardPointsData.points.map((point) => ({
    chain: point.chain || point.chainId || '',
    chainId: point.chain || point.chainId || '',
    points: point.points
  }));

  try {
    // Find existing entry for the wallet
    let existingEntry = await LeaderboardPointsModel.findOne({
      gifterWallet: normalizedWallet
    });

    if (existingEntry) {
      // Create a map of existing points by chain for easier lookup
      const existingPointsMap = new Map<string, number>(
        existingEntry.points.map((p:any) => [p.chain, p.points])
      );

      // Process new points
      processedPoints.forEach((newPointEntry) => {
        const existingPoints = existingPointsMap.get(newPointEntry.chain) || 0;
        
        // Accumulate points instead of just taking the max
        const updatedPoints = existingPoints + newPointEntry.points;
        
        existingPointsMap.set(newPointEntry.chain, updatedPoints);
      });

      // Convert map back to array
      existingEntry.points = Array.from(existingPointsMap).map(([chain, points]) => ({
        chain,
        points
      }));

      // Save the updated entry
      const savedEntry = await existingEntry.save();
      return savedEntry;
    } else {
      // Create new entry
      const leaderboardPoints = new LeaderboardPointsModel({
        gifterWallet: normalizedWallet,
        points: processedPoints
      });
      const savedEntry = await leaderboardPoints.save();
      return savedEntry;
    }
  } catch (error) {
    console.error('Error in createOrUpdateLeaderboardPoints:', error);
    throw error;
  }
};