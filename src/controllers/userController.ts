import { getUserCollection, getTransactionCollection } from '../lib/getCollections';
import { createOrUpdateLeaderboardPoints } from '../controllers/leaderboardPointsController';

export const userDataByTransactionHash = async (
  transactionHash: string,
) => {
  // Get transaction and user collections
  const TransactionModel = await getTransactionCollection();
  const UserModel = await getUserCollection();

  // Find the transaction by hash
  const transaction = await TransactionModel.findOne({ transactionHash });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const {
    claimerWallet,
    gifterWallet,
    chainId,
    claimerEmail
  } = transaction;

  // Validate essential fields
  if (!claimerWallet) {
    throw new Error('Claimer wallet address is required');
  }

  if (!claimerEmail) {
    throw new Error('Claimer email is missing from transaction data');
  }

  // Normalize addresses to lowercase
  const normalizedClaimerWallet = claimerWallet.toLowerCase();
  const normalizedClaimerEmail = claimerEmail.toLowerCase();
  const normalizedGifterWallet = gifterWallet.toLowerCase();
  const normalizedChainId = chainId;

  // Find existing user for the gifter
  const existingGifterUser = await UserModel.findOne({
    claimerWallet: normalizedGifterWallet
  });

  // Prepare the user data with local and universal depth storing
  const prepareAuthData = () => {
    // Prepare universal depth and local depth
    const universalDepth: { [key: string]: number } = {};
    const localDepth: { [key: string]: number } = {};

    // Check if gifter user exists and has user data for this chain
    if (existingGifterUser && existingGifterUser.authData) {
      const existingChainAuthData = existingGifterUser.authData.get(normalizedChainId);

      // Copy and increment Universal Depth
      if (existingChainAuthData?.universalDepth) {
        // Handle both Map and object cases
        const universalDepthSource = existingChainAuthData.universalDepth instanceof Map
          ? Object.fromEntries(existingChainAuthData.universalDepth)
          : existingChainAuthData.universalDepth;

        Object.entries(universalDepthSource).forEach(([addr, depth]) => {
          universalDepth[addr] = Number(depth) + 1;
        });
      }

      // If no universal depth from existing data, set gifter address depth
      if (Object.keys(universalDepth).length === 0) {
        universalDepth[normalizedGifterWallet] = 2;
      }

      // Copy and increment Local Depth
      if (existingChainAuthData?.localDepth) {
        // Handle both Map and object cases
        const localDepthSource = existingChainAuthData.localDepth instanceof Map
          ? Object.fromEntries(existingChainAuthData.localDepth)
          : existingChainAuthData.localDepth;

        Object.entries(localDepthSource).forEach(([addr, depth]) => {
          localDepth[addr] = Number(depth) + 1;
        });
      }

      // Ensure local depth has gifter and claimer addresses
      if (Object.keys(localDepth).length === 0) {
        localDepth[normalizedGifterWallet] = 1;
      }

      // Always add claimer wallet with 0 depth
      localDepth[normalizedClaimerWallet] = 0;
    } else {
      // If no existing gifter user, set initial depths
      universalDepth[normalizedGifterWallet] = 2;
      localDepth[normalizedGifterWallet] = 1;
      localDepth[normalizedClaimerWallet] = 0;
    }

    return {
      authStatus: true,
      gifterAddress: normalizedGifterWallet,
      universalDepth,
      localDepth
    };
  };

  // Prepare chain-specific auth data
  const chainSpecificAuthData = prepareAuthData();

  // Leaderboard Points Calculation
  const calculateLeaderboardPoints = async () => {
    const leaderboardPointsToSave: {
      gifterWallet: string,
      points: { chainId: string, points: number }[]
    }[] = [];

    for (const [address, depth] of Object.entries(chainSpecificAuthData.localDepth)) {
      let points = 1; // Base points
      if (depth > 0 && depth < 11) {
        points = Math.pow(2, 11 - depth);
      } else if (depth >= 11) {
        points = 1;
      } else if (depth <= 0) {
        points = 0;
      }

      // Always add the point entry for the specific chain
      leaderboardPointsToSave.push({
        gifterWallet: address,
        points: [{
          chainId: normalizedChainId,
          points: points
        }]
      });
    }

    return leaderboardPointsToSave;
  };

  // Calculate and save leaderboard points
  const leaderboardPointsToSave = await calculateLeaderboardPoints();

  // Save leaderboard points for each address in local depth
  await Promise.all(
    leaderboardPointsToSave.map(async (pointData) => {
      await createOrUpdateLeaderboardPoints(pointData);
    })
  );

  // Find existing user for the claimer
  const existingClaimerUser = await UserModel.findOne({
    claimerWallet: normalizedClaimerWallet
  });

  // Prepare update operation
  const updateOperation: any = {
    $set: {
      claimerEmail: normalizedClaimerEmail,
      [`authData.${normalizedChainId}`]: chainSpecificAuthData
    }
  };

  // If no existing user, ensure claimer wallet is set
  if (!existingClaimerUser) {
    updateOperation.$set.claimerWallet = normalizedClaimerWallet;
  }

  // Update or create user
  const claimerUser = await UserModel.findOneAndUpdate(
    { claimerWallet: normalizedClaimerWallet },
    updateOperation,
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  return claimerUser;
};