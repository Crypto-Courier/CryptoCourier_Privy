import { ethers } from 'ethers';
import { getUserCollection } from '../lib/getCollections';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  } else if (!ethers.isAddress(claimerWallet.toLowerCase())) {
    errors.push('Invalid Ethereum address format');
  }

  // Validate claimer email
  if (!claimerEmail) {
    errors.push('Claimer email is required');
  } else if (!emailRegex.test(claimerEmail)) {
    errors.push('Invalid email address format');
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

  // Check if user with same address or email already exists
  const existingUser = await UserModel.findOne({
    $or: [
      { claimerWallet: userData.claimerWallet.toLowerCase() },
      { claimerEmail: userData.claimerEmail.toLowerCase() }
    ]
  });

  if (existingUser) {
    throw new Error('User with this address or email already exists');
  }

  // Create and save the user
  const user = new UserModel(userData);
  return user.save();
};

export const getUserByAddress = async (claimerWallet: string) => {
  const UserModel = await getUserCollection();
  return UserModel.findOne({ claimerWallet: claimerWallet.toLowerCase() });
};

export const getUserByEmail = async (claimerEmail: string) => {
  const UserModel = await getUserCollection();
  return UserModel.findOne({ claimerEmail: claimerEmail.toLowerCase() });
};

export const updateUserAuthData = async (
  claimerWallet: string, 
  updateData: Record<string, AuthDataValue>
) => {
  const UserModel = await getUserCollection();
  
  // Validate the update data
  const validationErrors = validateUserInput({ 
    claimerWallet, 
    claimerEmail: 'placeholder@example.com',  // placeholder to pass email validation
    authData: updateData 
  });

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('; '));
  }

  return UserModel.findOneAndUpdate(
    { claimerWallet: claimerWallet.toLowerCase() },
    { $set: { authData: updateData } },
    { new: true }
  );
};

export const deleteUser = async (claimerWallet: string) => {
  const UserModel = await getUserCollection();
  return UserModel.findOneAndDelete({ claimerWallet: claimerWallet.toLowerCase() });
};