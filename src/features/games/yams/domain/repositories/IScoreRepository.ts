export interface ScoreData {
  playerName: string
  score: number
  yahtzeeBonus: number
  timestamp: string
}

export interface IScoreRepository {
  save(data: ScoreData): Promise<{ success: boolean; id?: string; error?: string }>
}