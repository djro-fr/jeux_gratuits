import type { YamsScoreBoard } from "../entities/YamsScoreBoard"
  
export interface ScoreTurnOutput {
  updatedScoreBoard: YamsScoreBoard
  scoreEarned: number | null

}
