import type { Die } from "../../domain/entities/Die"
import type { YamsCategory } from "../../domain/rules/calculateScore"
import type { YamsScoreBoard } from "../entities/YamsScoreBoard"

export interface ScoreTurnInput {
  yamsScoreBoard: YamsScoreBoard
  dice: Die[]
  category: YamsCategory
}