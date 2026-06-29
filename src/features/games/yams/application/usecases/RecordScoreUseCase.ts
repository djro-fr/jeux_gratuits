import { YamsGame } from "../../domain/aggregates/YamsGame"
import { CategoryAlreadyScoredError } from "../../domain/errors/YamsErrors"
import { calculateScoreByCategory, calculateYahtzeeBonus, hasOccurrences, YamsCategory } from "../../domain/rules/calculateScore"

/**
 * USE CASE
 * Records a score for the current turn and advances the game.
 * Handles Yahtzee bonus and turn validation.
 */
export class RecordScoreUseCase {
  execute(input: {
    game: YamsGame
    category: YamsCategory
  }): YamsGame {
    const { game, category } = input
    const scoreBoard = game.getScoreBoard()
    const dice = game.getCurrentTurn().getDiceRoll().getDice()

    if (!scoreBoard.canScore(category)) {
      throw new CategoryAlreadyScoredError({
        category,
        currentScore: scoreBoard.getScore(category)
      })
    }

    const score = calculateScoreByCategory(category, dice)
    let updatedBoard = scoreBoard.addScore(category, score ?? 0)

    if (hasOccurrences(5, dice)) {
      const yahtzeeScore = scoreBoard.getScore(YamsCategory.Yahtzee)
      if (yahtzeeScore !== null) {
        const bonus = calculateYahtzeeBonus(dice, yahtzeeScore)
        updatedBoard = updatedBoard.addYahtzeeBonus(bonus)
      }
    }

    const gameWithScore = new YamsGame(
      updatedBoard,
      game.getCurrentTurn(),
      game.getGameTurnNumber(),
      game.getValidatedTurns()
    )

    return gameWithScore.validateTurn(dice)
  }
}