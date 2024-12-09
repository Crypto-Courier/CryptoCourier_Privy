import { NextApiResponse } from 'next';
import { UserAuthData } from '../../types/authentication-data-types'
import { ethers } from 'ethers';

export function validateInput(data: Partial<UserAuthData>, requiredFields: string[]): void {
    const { walletAddress, email, authStatus } = data;

    // Wallet address validation
    if (requiredFields.includes('walletAddress') && (!walletAddress || !ethers.isAddress(walletAddress))) {
        throw new Error('Invalid wallet address');
    }

    // Email validation
    if (requiredFields.includes('email') && (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        throw new Error('Invalid email address');
    }

    // Auth status validation
    if (requiredFields.includes('authStatus') && typeof authStatus !== 'boolean') {
        throw new Error('Invalid authentication status: must be a boolean');
    }
}

export const handleError = (res: NextApiResponse, status: number, message: string, error?: any) => {
    console.error(message, error);
    return res.status(status).json({ message, error });
};