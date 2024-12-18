// export interface LeaderboardEntry {
//     address: string;
//     invites: number;
//     claims: number;
//     transactions: any[];
//     rank?: number;
// }

// export interface LeaderboardResponse {
//     status: 'loading' | 'success' | 'error';
//     message: string;
//     userDetails?: LeaderboardEntry;
//     topThreeUsers?: LeaderboardEntry[];
//     allUsers?: LeaderboardEntry[];
//     totalUsers?: number;
//     userRank?: number;
//     error?: string;
// }


export interface PointsEntry {
    chain: string;
    points: number;
  }
  
  export interface LeaderboardEntry {
    address: string;
    invites: number;
    claims: number;
    transactions: any[];
    rank?: number;
    points?: {
      total: number;
      byChain: PointsEntry[];
    };
  }
  
  export interface LeaderboardResponse {
    status: 'loading' | 'success' | 'error';
    message: string;
    userDetails?: LeaderboardEntry;
    topThreeUsers?: LeaderboardEntry[];
    allUsers?: LeaderboardEntry[];
    totalUsers?: number;
    userRank?: number;
    error?: string;
  }