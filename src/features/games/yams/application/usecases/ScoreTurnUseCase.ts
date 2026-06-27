import { CategoryAlreadyScoredError } from '../errors/YamsErrors'
import { calculateScoreByCategory, calculateYahtzeeBonus, hasOccurrences, YamsCategory } from '../../domain/rules/calculateScore'
import type { ScoreTurnInput, ScoreTurnOutput } from '../dtos/ScoreTurnDTO'

export class ScoreTurnUseCase {
  
  execute(input: ScoreTurnInput): ScoreTurnOutput {
    const { yamsScoreBoard, dice, category } = input

    if (!yamsScoreBoard.canScore(category)) {
      throw new CategoryAlreadyScoredError({
        category,
        currentScore: yamsScoreBoard.getScore(category)
      })
    }  

    const score = calculateScoreByCategory(category, dice)
    let scoreEarned = score ?? 0  
    let updatedBoard = yamsScoreBoard.addScore(category, scoreEarned)  
    
    if (hasOccurrences(5, dice)){
      const yahtzeeScore = yamsScoreBoard.getScore(YamsCategory.Yahtzee)
      if (yahtzeeScore !== null) {
        const bonus = calculateYahtzeeBonus(dice, yahtzeeScore)
        updatedBoard = updatedBoard.addYahtzeeBonus(bonus)
        scoreEarned += bonus 
      }
    }

    return {
      updatedScoreBoard: updatedBoard, 
      scoreEarned
    }
  }
}