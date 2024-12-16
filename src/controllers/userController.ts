import { ethers } from 'ethers';
import { getUserCollection, getTransactionCollection } from '../lib/getCollections';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

  // Find existing users for both claimer and gifter
  const existingClaimerUser = await UserModel.findOne({
    claimerWallet: normalizedClaimerWallet
  });

  const existingGifterUser = await UserModel.findOne({
    claimerWallet: normalizedGifterWallet
  });

  // Prepare auth data for the claimer
  const claimerAuthData = existingClaimerUser?.authData || {};

  // Calculate universal depth
  const universalDepth: DepthEntry = {
    ...existingClaimerUser?.authData?.[normalizedChainId]?.universalDepth || {}
  };
  const existingUniversalDepth = universalDepth[normalizedGifterWallet] || 0;
  universalDepth[normalizedGifterWallet] = existingUniversalDepth > 0
    ? existingUniversalDepth + 1
    : 2;

  // Calculate local depth
  const localDepth: DepthEntry = {};

  // If existing user, merge existing local depth
  if (existingClaimerUser?.authData?.[normalizedChainId]?.localDepth) {
    Object.entries(existingClaimerUser.authData[normalizedChainId].localDepth || {})
      .forEach(([addr, depth]) => {
        // Explicitly convert to number to resolve type issues
        localDepth[addr] = Number(depth) || 0;
      });
  }

  // Add new entries to local depth
  localDepth[normalizedGifterWallet] = 1;
  localDepth[normalizedClaimerWallet] = 0;

  // If previous transactions exist, increment depths
  if (existingClaimerUser?.authData?.[normalizedChainId]?.localDepth) {
    const previousLocalDepth = existingClaimerUser.authData[normalizedChainId].localDepth;
    Object.entries(previousLocalDepth).forEach(([addr, depth]) => {
      // Explicitly convert to number to resolve type issues
      const currentDepth = Number(depth) || 0;
      if (addr !== normalizedGifterWallet && addr !== normalizedClaimerWallet) {
        localDepth[addr] = currentDepth + 1;
      }
    });
  }

  // Prepare full auth data
  const chainSpecificAuthData = {
    authStatus: true,
    gifterAddress: normalizedGifterWallet,
    universalDepth,
    localDepth
  };

  // Update or create claimer user
  let claimerUser;
  // Ensure we always have a valid wallet address when creating/updating
  const userDataToUpsert = {
    claimerWallet: normalizedClaimerWallet,
    claimerEmail,
    authData: {
      [normalizedChainId]: chainSpecificAuthData
    }
  };

  if (existingClaimerUser) {
    // Update existing user
    claimerUser = await UserModel.findOneAndUpdate(
      { claimerWallet: normalizedClaimerWallet },
      {
        $set: userDataToUpsert
      },
      {
        new: true,
        upsert: true,  
        runValidators: true
      }
    );
  } else {
    // Create new user
    claimerUser = await createUser({
      claimerWallet: normalizedClaimerWallet,
      claimerEmail,
      authData: {
        [normalizedChainId]: chainSpecificAuthData
      }
    });
  }

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