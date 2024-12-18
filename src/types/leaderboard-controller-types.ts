export interface PointEntry {
    chain: string;
    chainId?: string;
    points: number;
}

export interface LeaderboardPointsData {
    gifterWallet: string;
    points: PointEntry[];
}