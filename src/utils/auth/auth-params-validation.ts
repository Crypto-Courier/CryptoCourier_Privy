import { UserAuthData } from '../../types/authentication-data-types'
import { ethers } from 'ethers';

export function validateInput(data: Partial<UserAuthData>): void {
    const { walletAddress, email, authStatus } = data;

    // Wallet address validation
    if (!walletAddress || !ethers.isAddress(walletAddress)) {
        throw new Error('Invalid wallet address');
    }

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email address');
    }

    // Auth status validation
    const validAuthStatuses = ['pending', 'authenticated'];
    if (!authStatus || !validAuthStatuses.includes(authStatus)) {
        throw new Error('Invalid authentication status');
    }
}