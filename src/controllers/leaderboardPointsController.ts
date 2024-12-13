import { ethers } from 'ethers';
import { getLeaderboardPointsCollection } from '../lib/getCollections';

export const validateLeaderboardPointsInput = (data: any) => {
  const {
    gifterWallet,
    points
  } = data;

  const errors: string[] = [];

  // Validate gifter wallet address
  if (!ethers.isAddress(gifterWallet)) {
    errors.push('Invalid gifter wallet address');
  }

  // Validate points array
  if (!Array.isArray(points) || points.length === 0) {
    errors.push('Points must be a non-empty array');
  } else {
    points.forEach((pointEntry, index) => {
      // Validate each point entry
      if (!pointEntry.chain || typeof pointEntry.chain !== 'string' || pointEntry.chain.trim().length === 0) {
        errors.push(`Invalid or missing chain name at index ${index}`);
      }

      if (typeof pointEntry.points !== 'number' || pointEntry.points < 0) {
        errors.push(`Points must be a non-negative number at index ${index}`);
      }
    });
  }

  return errors;
};

export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: any) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();

  // Find existing entry for the wallet
  let existingEntry = await LeaderboardPointsModel.findOne({ 
    gifterWallet: leaderboardPointsData.gifterWallet 
  });

  if (existingEntry) {
    // Update existing entry
    // Merge and update points for existing and new chains
    const updatedPoints = [...existingEntry.points];

    leaderboardPointsData.points.forEach((newPointEntry: any) => {
      const existingChainIndex = updatedPoints.findIndex(
        (p) => p.chain.toLowerCase() === newPointEntry.chain.toLowerCase()
      );

      if (existingChainIndex !== -1) {
        // Update existing chain points
        updatedPoints[existingChainIndex].points += newPointEntry.points;
      } else {
        // Add new chain points
        updatedPoints.push(newPointEntry);
      }
    });

    existingEntry.points = updatedPoints;
    return existingEntry.save();
  } else {
    // Create new entry
    const leaderboardPoints = new LeaderboardPointsModel(leaderboardPointsData);
    return leaderboardPoints.save();
  }
};

export const getLeaderboardPointsByWallet = async (gifterWallet: string) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();
  return LeaderboardPointsModel.findOne({ gifterWallet });
};

export const getTopLeaderboardPoints = async (limit: number = 10, chain?: string) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();
  
  let aggregationPipeline: any[] = [
    // Unwind the points array
    { $unwind: '$points' },
    // Group by wallet and sum points
    { 
      $group: {
        _id: '$gifterWallet',
        totalPoints: { $sum: '$points.points' }
      }
    },
    // Sort by total points in descending order
    { $sort: { totalPoints: -1 } },
    // Limit the results
    { $limit: limit }
  ];

  // If a specific chain is provided, filter by that chain
  if (chain) {
    aggregationPipeline.splice(1, 0, {
      $match: { 'points.chain': chain }
    });
  }

  return LeaderboardPointsModel.aggregate(aggregationPipeline);
};