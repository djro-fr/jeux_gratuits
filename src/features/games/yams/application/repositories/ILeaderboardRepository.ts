export interface LeaderboardScore {
  rank: number
  playerName: string
  score: number
  timestamp: string
}

export interface ILeaderboardRepository {
  getTopScores(limit: number): Promise<LeaderboardScore[]>
  subscribe(callback: (scores: LeaderboardScore[]) => void): () => void
}