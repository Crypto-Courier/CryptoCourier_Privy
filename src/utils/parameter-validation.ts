import { UserAuthData } from '../types/authentication-data-types'
import { ethers } from 'ethers';

// Validate Input for Authentication Data
export function validateInput(data: Partial<UserAuthData>, requiredFields: string[]): void {
    const { walletAddress, email, authStatus } = data;

    // Wallet address validation
    if (requiredFields.includes('walletAddress') && (!walletAddress || !ethers.isAddress(walletAddress))) {
        throw new Error('Invalid wallet address');
    }

    // Email validation
    if (requiredFields.includes('email') && (!email || !isValidEmail(email))) {
        throw new Error('Invalid email address');
    }

    // Auth status validation
    if (requiredFields.includes('authStatus') && typeof authStatus !== 'boolean') {
        throw new Error('Invalid authentication status: must be a boolean');
    }
}

// For validate email with return type bool
export const isValidEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
};