// Types for data store and maintain

// Basic point entry for both global and monthly leaderboard
export interface PointEntry {
  chainId: string;
  points: number;
}

// Nested data store month by month data
export interface MonthlyPointEntry {
  month: string;
  points: PointEntry[];
}

// Leaderbord with combined global and monthly data
export interface LeaderboardPointsData {
  gifterWallet: string;
  points: PointEntry[];
  monthlyPoints: MonthlyPointEntry[];
}
