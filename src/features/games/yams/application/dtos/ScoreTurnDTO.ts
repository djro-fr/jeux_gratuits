import type { Die } from "../../domain/entities/Die"
import type { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import type { YamsCategory } from "../../domain/rules/calculateScore"

export interface ScoreTurnInput {
  yamsScoreBoard: YamsScoreBoard
  dice: Die[]
  category: YamsCategory
}
  
export interface ScoreTurnOutput {
  updatedScoreBoard: YamsScoreBoard
  scoreEarned: number | null
}
