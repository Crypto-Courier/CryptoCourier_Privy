export interface UserAuthData {
    walletAddress: string;
    email?: string|null;
    authStatus?: boolean;
    authenticatedAt?: Date;
    invitedUsers?: string[];
    numberOfInvitedUsers?: number;
    createdAt?: Date;
    lastConnectedAt?: Date;
}

export interface AuthRequestBody {
    walletAddress: string;
    email?: string;
    authStatus?: boolean;
}