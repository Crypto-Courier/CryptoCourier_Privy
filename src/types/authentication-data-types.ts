export interface UserAuthData {
    walletAddress: string;
    email?: string|null;
    authStatus?: boolean;
    authenticatedAt?: Date;
    invitedUsers?: string[];
    numberOfInvitedUsers?: number;
}

export interface AuthRequestBody {
    walletAddress: string;
    email?: string;
    authStatus?: boolean;
}