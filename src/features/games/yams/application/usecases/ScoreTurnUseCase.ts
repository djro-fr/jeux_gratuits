import { CategoryAlreadyScoredError, ImpossibleScoreError } from '../errors/YamsErrors'
import { calculateScoreByCategory, calculateYahtzeeBonus, hasOccurrences, YamsCategory } from '../../domain/rules/calculateScore'
import type { ScoreTurnInput } from './ScoreTurnInput'
import type { ScoreTurnOutput } from './ScoreTurnOutput'

export class ScoreTurnUseCase {
  
  execute(input: ScoreTurnInput): ScoreTurnOutput {
    if (!input.yamsScoreBoard.canScore(input.category)) 
      throw new CategoryAlreadyScoredError(input.category)    

    const score = calculateScoreByCategory(input.category, input.dice)
    if (score === null) 
      throw new ImpossibleScoreError(input.category)        

    let updatedBoard = input.yamsScoreBoard.addScore(input.category, score)  
    let scoreEarned = score  

    if (hasOccurrences(5, input.dice)){
      const yahtzeeScore = input.yamsScoreBoard.getScore(YamsCategory.Yahtzee)
      if (yahtzeeScore !== null) {
        const bonus = calculateYahtzeeBonus(input.dice, yahtzeeScore)
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