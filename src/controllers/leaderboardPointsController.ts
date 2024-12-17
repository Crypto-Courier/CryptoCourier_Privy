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

interface PointEntry {
  chain: string;
  chainId?: string;
  points: number;
}

interface LeaderboardPointsData {
  gifterWallet: string;
  points: PointEntry[];
}

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

// export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: any) => {
//   console.log('Updating Leaderboard Points:', JSON.stringify(leaderboardPointsData, null, 2));

//   const LeaderboardPointsModel = await getLeaderboardPointsCollection();

//   // Normalize wallet address
//   const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

//   // Ensure points have both chain and chainId
//   const processedPoints = leaderboardPointsData.points.map((point: any) => ({
//     chain: point.chain || point.chainId,
//     chainId: point.chain || point.chainId,
//     points: point.points
//   }));

//   try {
//     // Find existing entry for the wallet
//     let existingEntry = await LeaderboardPointsModel.findOne({
//       gifterWallet: normalizedWallet
//     });

//     if (existingEntry) {
//       console.log('Existing Entry Found:', existingEntry);
      
//       const updatedPoints = [...existingEntry.points];

//       processedPoints.forEach((newPointEntry: any) => {
//         const existingChainIndex = updatedPoints.findIndex(
//           (p) => (p.chain?.toLowerCase() === newPointEntry.chain?.toLowerCase() ||
//             p.chainId?.toLowerCase() === newPointEntry.chainId?.toLowerCase())
//         );

//         if (existingChainIndex !== -1) {
//           // Update existing chain points (take the maximum of existing and new points)
//           updatedPoints[existingChainIndex].points = Math.max(
//             updatedPoints[existingChainIndex].points,
//             newPointEntry.points
//           );
//         } else {
//           // Add new chain points
//           updatedPoints.push({
//             chain: newPointEntry.chain,
//             chainId: newPointEntry.chainId,
//             points: newPointEntry.points
//           });
//         }
//       });

//       existingEntry.points = updatedPoints;
//       const savedEntry = await existingEntry.save();
//       console.log('Updated Entry:', savedEntry);
//       return savedEntry;
//     } else {
//       // Create new entry
//       const leaderboardPoints = new LeaderboardPointsModel({
//         gifterWallet: normalizedWallet,
//         points: processedPoints
//       });
//       const savedEntry = await leaderboardPoints.save();
//       console.log('New Entry Created:', savedEntry);
//       return savedEntry;
//     }
//   } catch (error) {
//     console.error('Error in createOrUpdateLeaderboardPoints:', error);
//     throw error;
//   }
// };

// export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: any) => {
//   const LeaderboardPointsModel = await getLeaderboardPointsCollection();

//   // Normalize wallet address
//   const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

//   // Find existing entry for the wallet
//   let existingEntry = await LeaderboardPointsModel.findOne({ 
//     gifterWallet: normalizedWallet 
//   });

//   if (existingEntry) {
//     // Update existing entry
//     // Merge and update points for existing and new chains
//     const updatedPoints = [...existingEntry.points];

//     leaderboardPointsData.points.forEach((newPointEntry: any) => {
//       const existingChainIndex = updatedPoints.findIndex(
//         (p) => p.chain.toLowerCase() === newPointEntry.chain.toLowerCase()
//       );

//       if (existingChainIndex !== -1) {
//         // Update existing chain points (take the maximum of existing and new points)
//         updatedPoints[existingChainIndex].points = Math.max(
//           updatedPoints[existingChainIndex].points, 
//           newPointEntry.points
//         );
//       } else {
//         // Add new chain points
//         updatedPoints.push({
//           chain: newPointEntry.chain,
//           points: newPointEntry.points
//         });
//       }
//     });

//     existingEntry.points = updatedPoints;
//     return existingEntry.save();
//   } else {
//     // Create new entry
//     const leaderboardPoints = new LeaderboardPointsModel({
//       gifterWallet: normalizedWallet,
//       points: leaderboardPointsData.points
//     });
//     return leaderboardPoints.save();
//   }
// };

// export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: any) => {
//   const LeaderboardPointsModel = await getLeaderboardPointsCollection();

//   // Normalize wallet address
//   const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

//   // Ensure points have both chain and chainId
//   const processedPoints = leaderboardPointsData.points.map((point: any) => ({
//     chain: point.chain || point.chainId,
//     chainId: point.chain || point.chainId,
//     points: point.points
//   }));

//   // Find existing entry for the wallet
//   let existingEntry = await LeaderboardPointsModel.findOne({
//     gifterWallet: normalizedWallet
//   });

//   if (existingEntry) {
//     // Update existing entry
//     const updatedPoints = [...existingEntry.points];

//     processedPoints.forEach((newPointEntry: any) => {
//       const existingChainIndex = updatedPoints.findIndex(
//         (p) => (p.chain?.toLowerCase() === newPointEntry.chain?.toLowerCase() ||
//           p.chainId?.toLowerCase() === newPointEntry.chainId?.toLowerCase())
//       );

//       if (existingChainIndex !== -1) {
//         // Update existing chain points (take the maximum of existing and new points)
//         updatedPoints[existingChainIndex].points = Math.max(
//           updatedPoints[existingChainIndex].points,
//           newPointEntry.points
//         );
//       } else {
//         // Add new chain points
//         updatedPoints.push({
//           chain: newPointEntry.chain,
//           chainId: newPointEntry.chainId,
//           points: newPointEntry.points
//         });
//       }
//     });

//     existingEntry.points = updatedPoints;
//     return existingEntry.save();
//   } else {
//     // Create new entry
//     const leaderboardPoints = new LeaderboardPointsModel({
//       gifterWallet: normalizedWallet,
//       points: processedPoints
//     });
//     return leaderboardPoints.save();
//   }
// };

// export const createOrUpdateLeaderboardPoints = async (leaderboardPointsData: any) => {
//   const LeaderboardPointsModel = await getLeaderboardPointsCollection();

//   // Normalize wallet address
//   const normalizedWallet = leaderboardPointsData.gifterWallet.toLowerCase();

//   // Find existing entry for the wallet
//   let existingEntry = await LeaderboardPointsModel.findOne({ 
//     gifterWallet: normalizedWallet 
//   });

//   if (existingEntry) {
//     // Update existing entry
//     // Merge and update points for existing and new chains
//     const updatedPoints = [...existingEntry.points];

//     leaderboardPointsData.points.forEach((newPointEntry: any) => {
//       const existingChainIndex = updatedPoints.findIndex(
//         (p) => p.chain.toLowerCase() === newPointEntry.chain.toLowerCase()
//       );

//       if (existingChainIndex !== -1) {
//         // Update existing chain points (take the maximum of existing and new points)
//         updatedPoints[existingChainIndex].points = Math.max(
//           updatedPoints[existingChainIndex].points, 
//           newPointEntry.points
//         );
//       } else {
//         // Add new chain points
//         updatedPoints.push({
//           chain: newPointEntry.chain,
//           points: newPointEntry.points
//         });
//       }
//     });

//     existingEntry.points = updatedPoints;
//     return existingEntry.save();
//   } else {
//     // Create new entry
//     const leaderboardPoints = new LeaderboardPointsModel({
//       gifterWallet: normalizedWallet,
//       points: leaderboardPointsData.points
//     });
//     return leaderboardPoints.save();
//   }
// };
export const getLeaderboardPointsByWallet = async (gifterWallet: string) => {
  const LeaderboardPointsModel = await getLeaderboardPointsCollection();
  const entry = await LeaderboardPointsModel.findOne({
    gifterWallet: gifterWallet.toLowerCase()
  });
  console.log(`Leaderboard entry for ${gifterWallet}:`, entry);
  return entry;
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