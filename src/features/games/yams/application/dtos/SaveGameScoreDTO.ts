export interface SaveGameScoreInput {
  playerName: string
  score: number
  yahtzeeBonus: number
}

export interface SaveGameScoreOutput {
  success: boolean
  id?: string
  error?: string
}