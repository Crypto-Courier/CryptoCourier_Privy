export interface UserAuthData {
    walletAddress: string;
    email: string;
    authStatus: 'pending' | 'authenticated';
    createdAt?: Date;
    authenticatedAt?: Date;
}