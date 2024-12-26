import { getUserCollection, getTransactionCollection } from '../lib/getCollections';
import { createOrUpdateLeaderboardPoints } from '../controllers/leaderboardPointsController';

export const userDataByTransactionHash = async (
  transactionHash: string,
) => {
  const TransactionModel = await getTransactionCollection();
  const UserModel = await getUserCollection();

  const transaction = await TransactionModel.findOne({ transactionHash });
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const {
    claimerWallet,
    gifterWallet,
    chainId,
    claimerEmail,
    authenticatedAt
  } = transaction;

  if (!claimerWallet) {
    throw new Error('Claimer wallet address is required');
  }

  if (!claimerEmail) {
    throw new Error('Claimer email is missing from transaction data');
  }

  const normalizedClaimerWallet = claimerWallet.toLowerCase();
  const normalizedClaimerEmail = claimerEmail.toLowerCase();
  const normalizedGifterWallet = gifterWallet.toLowerCase();
  const normalizedChainId = chainId;

   // Check if user exists with this wallet and chainId
   const existingUser = await UserModel.findOne({
    $or: [
      { claimerWallet: normalizedClaimerWallet },
      { claimerEmail: normalizedClaimerEmail }
    ]
  });

  const authDataForChain = existingUser?.authData?.get(normalizedChainId);

  // If user exists and has auth data for this chainId, skip processing
  if (authDataForChain) {
    console.log("Hello existing user with chainID, can i know which chainID is there for user? ", authDataForChain)
    return existingUser;
  }
  
  // Ensure authenticatedAt is a proper Date object
  const authDate = authenticatedAt ? new Date(authenticatedAt) : new Date();
  const monthYear = `${(authDate.getMonth() + 1).toString().padStart(2, '0')}/${authDate.getFullYear()}`;

  const existingGifterUser = await UserModel.findOne({
    claimerWallet: normalizedGifterWallet
  });

  const prepareAuthData = () => {
    const universalDepth: { [key: string]: number } = {};
    const localDepth: { [key: string]: number } = {};

    if (existingGifterUser?.authData) {
      const existingChainAuthData = existingGifterUser.authData.get(normalizedChainId);

      if (existingChainAuthData?.universalDepth) {
        const universalDepthSource = existingChainAuthData.universalDepth instanceof Map
          ? Object.fromEntries(existingChainAuthData.universalDepth)
          : existingChainAuthData.universalDepth;

        Object.entries(universalDepthSource).forEach(([addr, depth]) => {
          universalDepth[addr] = Number(depth) + 1;
        });
      }

      if (Object.keys(universalDepth).length === 0) {
        universalDepth[normalizedGifterWallet] = 2;
      }

      if (existingChainAuthData?.localDepth) {
        const localDepthSource = existingChainAuthData.localDepth instanceof Map
          ? Object.fromEntries(existingChainAuthData.localDepth)
          : existingChainAuthData.localDepth;

        Object.entries(localDepthSource).forEach(([addr, depth]) => {
          localDepth[addr] = Number(depth) + 1;
        });
      }

      if (Object.keys(localDepth).length === 0) {
        localDepth[normalizedGifterWallet] = 1;
      }

      localDepth[normalizedClaimerWallet] = 0;
    } else {
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

  const chainSpecificAuthData = prepareAuthData();

  const calculateLeaderboardPoints = async () => {
    const leaderboardPointsToSave: {
      gifterWallet: string;
      points: { chainId: string; points: number }[];
      monthlyPoints: {
        month: string;
        points: { chainId: string; points: number }[];
      }[];
    }[] = [];

    for (const [address, depth] of Object.entries(chainSpecificAuthData.localDepth)) {
      let points = 1;
      if (depth > 0 && depth < 11) {
        points = Math.pow(2, 11 - depth);
      } else if (depth >= 11) {
        points = 1;
      } else if (depth <= 0) {
        points = 0;
      }

      // Create separate point entries for global and monthly points
      const pointEntry = {
        chainId: normalizedChainId,
        points: points
      };

      leaderboardPointsToSave.push({
        gifterWallet: address,
        points: [pointEntry],
        monthlyPoints: [{
          month: monthYear,
          points: [pointEntry]
        }]
      });
    }

    return leaderboardPointsToSave;
  };

  const leaderboardPointsToSave = await calculateLeaderboardPoints();

  // Save leaderboard points sequentially to avoid race conditions
  for (const pointData of leaderboardPointsToSave) {
    await createOrUpdateLeaderboardPoints(pointData);
  }

  // const existingClaimerUser = await UserModel.findOne({
  //   claimerWallet: normalizedClaimerWallet
  // });

  const updateOperation: any = {
    $set: {
      claimerEmail: normalizedClaimerEmail,
      [`authData.${normalizedChainId}`]: chainSpecificAuthData
    }
  };

  if (!existingUser) {
    updateOperation.$set.claimerWallet = normalizedClaimerWallet;
  }

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