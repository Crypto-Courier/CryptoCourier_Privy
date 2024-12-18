export interface PointEntry {
    chainId: string;
    points: number;
}

export interface LeaderboardPointsData {
    gifterWallet: string;
    points: PointEntry[];
}