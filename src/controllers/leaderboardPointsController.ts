import { getLeaderboardPointsCollection } from '../lib/getCollections';
import { PointEntry, LeaderboardPointsData } from '../types/leaderboard-controller-types';

// Create or Modify the leaderboard for gifter
export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: LeaderboardPointsData) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();

  // Normalize wallet address
  const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

  // Ensure points have chainId
  const processedPoints: PointEntry[] = leaderboardPointsData.points;

  try {
    // Find existing entry for the wallet
    let existingEntry = await LeaderboardPointsModel.findOne({
      gifterWallet: normalizedWallet
    });

    if (existingEntry) {
      // Create a map of existing points by chainId for easier lookup
      const existingPointsMap = new Map<string, number>(
        existingEntry.points.map((p:any) => [p.chainId, p.points])
      );

      // Process new points
      processedPoints.forEach((newPointEntry) => {
        const existingPoints = existingPointsMap.get(newPointEntry.chainId) || 0;
        
        // Accumulate points instead of just taking the max
        const updatedPoints = existingPoints + newPointEntry.points;
        
        existingPointsMap.set(newPointEntry.chainId, updatedPoints);
      });

      // Convert map back to array
      existingEntry.points = Array.from(existingPointsMap).map(([chainId, points]) => ({
        chainId,
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
    console.error('Error in create or update leaderboard points:', error);
    throw error;
  }
};