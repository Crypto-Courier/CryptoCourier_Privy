export interface PointEntry {
    chainId: string;
    points: number;
}

export interface MonthlyPointEntry {
    month: string;
    points: PointEntry[];
}

export interface LeaderboardPointsData {
    gifterWallet: string;
    points: PointEntry[];
    monthlyPoints: MonthlyPointEntry[];
}