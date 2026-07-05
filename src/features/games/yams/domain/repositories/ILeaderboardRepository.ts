export interface LeaderboardScore {
  id: string
  rank: number
  playerName: string
  score: number
  timestamp: string
}

export interface ILeaderboardRepository {
  getTopScores(limit: number): Promise<LeaderboardScore[]>
  subscribe(callback: (scores: LeaderboardScore[]) => void): () => void
  getPlayerRank(playerScore: number): Promise<number>  
  getPlayerBestScore(playerName: string): Promise<number | null>  
}