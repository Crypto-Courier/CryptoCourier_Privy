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

// Leaderboard entry to fetch leaderboard for filter purpose
export interface LeaderboardEntry {
  address: string;
  invites: number;
  claims: number;
  transactions: any[];
  rank: number; 
  points: {
    total: number;
    byChain: PointEntry[];
  };
}

// Leaderboard response to prepare and show data in leaderboard page
export interface LeaderboardResponse {
  status: 'loading' | 'success' | 'error';
  message: string;
  userDetails?: LeaderboardEntry;
  topThreeUsers?: LeaderboardEntry[];
  allUsers?: LeaderboardEntry[];
  totalUsers?: number;
  userRank?: number;
  error?: string;
  month?:string;
}