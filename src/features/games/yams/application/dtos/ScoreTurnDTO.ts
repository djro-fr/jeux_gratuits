import type { Die } from "../../domain/valueObjects/Die"
import type { YamsScoreBoard } from "../../domain/valueObjects/YamsScoreBoard"
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
