import { getLeaderboardPointsCollection } from "../lib/getCollections";
import {
  PointEntry,
  LeaderboardPointsData,
  MonthlyPointEntry,
} from "../types/leaderboard-types-combined";

export const createOrUpdateLeaderboardPoints = async (
  leaderboardPointsData: LeaderboardPointsData
) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();

  const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

  // Destructure the global points and monthly points data from the input
  const processedPoints: PointEntry[] = leaderboardPointsData.points;
  const processedMonthlyPoints: MonthlyPointEntry[] =
    leaderboardPointsData.monthlyPoints;

  try {
    // Check gifter is already exist or not
    const existingEntry = await LeaderboardPointsModel.findOne({
      gifterWallet: normalizedWallet,
    });

    // If the gifter's entry exists, update the points otherwise, create a new entry
    if (existingEntry) {
      // Handle global points
      const existingPointsMap = new Map<string, number>(
        existingEntry.points.map((p: any) => [p.chainId, p.points])
      );

      processedPoints.forEach((newPointEntry) => {
        const existingPoints =
          existingPointsMap.get(newPointEntry.chainId) || 0;
        const updatedPoints = existingPoints + newPointEntry.points;
        existingPointsMap.set(newPointEntry.chainId, updatedPoints);
      });

      existingEntry.points = Array.from(existingPointsMap).map(
        ([chainId, points]) => ({
          chainId,
          points,
        })
      );

      // Handle monthly points
      processedMonthlyPoints.forEach((monthlyPointEntry) => {
        // Find the existing entry for the same month, if it exists
        const existingMonthEntry = existingEntry.monthlyPoints?.find(
          (m: MonthlyPointEntry) => m.month === monthlyPointEntry.month
        );

        // If month entry exists, update the points otherwise, create a new entry
        if (existingMonthEntry) {
          const monthlyPointsMap = new Map<string, number>(
            existingMonthEntry.points.map((p: PointEntry) => [
              p.chainId,
              p.points,
            ])
          );

          monthlyPointEntry.points.forEach((newPointEntry) => {
            const existingPoints =
              monthlyPointsMap.get(newPointEntry.chainId) || 0;
            const updatedPoints = existingPoints + newPointEntry.points;
            monthlyPointsMap.set(newPointEntry.chainId, updatedPoints);
          });

          existingMonthEntry.points = Array.from(monthlyPointsMap).map(
            ([chainId, points]) => ({
              chainId,
              points,
            })
          );
        } else {
          if (!existingEntry.monthlyPoints) {
            existingEntry.monthlyPoints = [];
          }

          existingEntry.monthlyPoints.push(monthlyPointEntry);
        }
      });

      return await existingEntry.save();
    } else {
      const leaderboardPoints = new LeaderboardPointsModel({
        gifterWallet: normalizedWallet,
        points: processedPoints,
        monthlyPoints: processedMonthlyPoints,
      });

      return await leaderboardPoints.save();
    }
  } catch (error) {
    console.error("Error while adding leaderboard points:", error);
    throw error;
  }
};
