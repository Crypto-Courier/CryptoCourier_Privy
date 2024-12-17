import { ethers } from 'ethers';
import { getUserCollection, getTransactionCollection } from '../lib/getCollections';

interface DepthEntry {
  [address: string]: number;
}

// Define types for the User schema
interface AuthDataValue {
  authStatus: boolean;
  gifterAddress?: string;
  universalDepth?: Record<string, number>;
  localDepth?: Record<string, number>;
}

interface UserInput {
  claimerWallet: string;
  claimerEmail: string;
  authData?: Record<string, AuthDataValue>;
}

export const validateUserInput = (data: UserInput) => {
  const {
    claimerWallet,
    claimerEmail,
    authData
  } = data;

  const errors: string[] = [];

  // Validate claimer address
  if (!claimerWallet) {
    errors.push('Claimer address is required');
  } else if (!ethers.isAddress(claimerWallet)) {
    errors.push('Invalid Ethereum address format');
  }

  // Validate claimer email
  if (!claimerEmail) {
    errors.push('Claimer email is required');
  }

  // Optional: Validate authData structure if provided
  if (authData) {
    Object.entries(authData).forEach(([key, value]) => {
      // Validate gifter address if present
      if (value.gifterAddress && !ethers.isAddress(value.gifterAddress.toLowerCase())) {
        errors.push(`Invalid gifter address for key: ${key}`);
      }

      // Validate authStatus is a boolean
      if (typeof value.authStatus !== 'boolean') {
        errors.push(`Invalid authStatus for key: ${key}`);
      }

      // Validate universal and local depth maps
      if (value.universalDepth && typeof value.universalDepth !== 'object') {
        errors.push(`Invalid universalDepth for key: ${key}`);
      }

      if (value.localDepth && typeof value.localDepth !== 'object') {
        errors.push(`Invalid localDepth for key: ${key}`);
      }
    });
  }

  return errors;
};

export const createUser = async (userData: UserInput) => {
  const UserModel = await getUserCollection();

  // Validate input
  const validationErrors = validateUserInput(userData);
  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('; '));
  }

  // Ensure walletAddress is not null
  if (!userData.claimerWallet) {
    throw new Error('Wallet address cannot be null');
  }

  // Check if user with same address or email already exists
  const existingUser = await UserModel.findOne({
    $or: [
      { claimerWallet: userData.claimerWallet.toLowerCase() },
      { claimerEmail: userData.claimerEmail.toLowerCase() }
    ]
  });

  if (existingUser) {
    // throw new Error('User with this address or email already exists');
    return existingUser;
  }

  // Create and save the user
  const userDataToSave = {
    ...userData,
    claimerWallet: userData.claimerWallet.toLowerCase(),
    claimerEmail: userData.claimerEmail.toLowerCase()
  };

  // Create and save the user
  const user = new UserModel(userDataToSave);
  return user.save();
};

// Enhanced function to handle user authentication based on transaction
export const authenticateUserByTransactionHash = async (
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
  const normalizedGifterWallet = gifterWallet.toLowerCase();
  const normalizedChainId = chainId;

  // Check if a user already exists with the exact claimer address and chain ID
  const existingUser = await UserModel.findOne({
    claimerWallet: normalizedClaimerWallet,
    [`authData.${normalizedChainId}`]: { $exists: true }
  });

  // If user exists with the same claimer address and chain ID, return the existing user without modifications
  if (existingUser) {
    console.log('User already exists with this claimer address and chain ID');
    return existingUser;
  }
  
  // Find existing users for both gifter and claimer
  const existingGifterUser = await UserModel.findOne({
    claimerWallet: normalizedGifterWallet
  });

  console.log("Hello User", existingGifterUser)
  // Prepare universal depth and local depth
  const universalDepth: DepthEntry = {};
  const localDepth: DepthEntry = {};

  // Universal Depth Calculation
  // Universal Depth Calculation
  if (existingGifterUser && existingGifterUser.authData &&
    existingGifterUser.authData.get(normalizedChainId)?.universalDepth) {
    // Get the specific chain's auth data
    const chainAuthData = existingGifterUser.authData.get(normalizedChainId);

    // Check if universalDepth is a Map
    if (chainAuthData.universalDepth instanceof Map) {
      // Iterate over Map entries
      chainAuthData.universalDepth.forEach((depth: number, addr: string) => {
        universalDepth[addr] = Number(depth) + 1;
      });
    } else if (typeof chainAuthData.universalDepth === 'object') {
      // If it's a plain object
      Object.entries(chainAuthData.universalDepth).forEach(([addr, depth]) => {
        universalDepth[addr] = Number(depth) + 1;
      });
    }
  } else {
    // If no existing user, set universal depth to 2
    universalDepth[normalizedGifterWallet] = 2;
  }

  // Local Depth Calculation
  // Local Depth Calculation
  if (existingGifterUser && existingGifterUser.authData &&
    existingGifterUser.authData.get(normalizedChainId)?.localDepth) {
    // Get the specific chain's auth data
    const chainAuthData = existingGifterUser.authData.get(normalizedChainId);

    // Check if localDepth is a Map
    if (chainAuthData.localDepth instanceof Map) {
      // Iterate over Map entries
      chainAuthData.localDepth.forEach((depth:number, addr:string) => {
        localDepth[addr] = Number(depth) + 1;
      });
    } else if (typeof chainAuthData.localDepth === 'object') {
      // If it's a plain object
      Object.entries(chainAuthData.localDepth).forEach(([addr, depth]) => {
        localDepth[addr] = Number(depth) + 1;
      });
    }

    // Add new claimer address with 0 depth
    localDepth[normalizedClaimerWallet] = 0;
  } else {
    // If no existing user, start with gifter address 1 and claimer address 0
    localDepth[normalizedGifterWallet] = 1;
    localDepth[normalizedClaimerWallet] = 0;
  }

  // Prepare full auth data
  const chainSpecificAuthData = {
    authStatus: true,
    gifterAddress: normalizedGifterWallet,
    universalDepth,
    localDepth
  };

  // Prepare user data to upsert
  const userDataToUpsert = {
    claimerWallet: normalizedClaimerWallet,
    claimerEmail,
    authData: {
      [normalizedChainId]: chainSpecificAuthData
    }
  };

  // Create or update user
  const claimerUser = await UserModel.findOneAndUpdate(
    { claimerWallet: normalizedClaimerWallet },
    { $set: userDataToUpsert },
    {
      new: true,
      upsert: true,
      runValidators: true
    }
  );

  // Mark transaction as authenticated
  await TransactionModel.findOneAndUpdate(
    { transactionHash },
    {
      authenticated: true,
      authenticatedAt: new Date()
    }
  );

  return claimerUser;
};