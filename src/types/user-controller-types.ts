export interface AuthDataValue {
    authStatus: boolean;
    gifterAddress?: string;
    universalDepth?: Record<string, number>;
    localDepth?: Record<string, number>;
}

export interface UserInput {
    claimerWallet: string;
    claimerEmail: string;
    authData?: Record<string, AuthDataValue>;
}