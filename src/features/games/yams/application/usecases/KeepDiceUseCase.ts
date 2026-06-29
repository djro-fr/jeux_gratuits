import { YamsGame } from "../../domain/aggregates/YamsGame"
import { 
  CantRollError, 
  DuplicateDiceIndicesError, 
  InvalidDiceIndicesError, 
  TooManyDiceKeptError 
} from "../errors/YamsErrors"

/**
 * USE CASE
 * Keeps selected dice and rerolls others for the next turn.
 */
export class KeepDiceUseCase {
  execute(input: {
    game: YamsGame
    indicesToKeep: number[]
  }): YamsGame {
    const { game, indicesToKeep } = input
    const currentTurn = game.getCurrentTurn()
    
    const hasNoDuplicates = indicesToKeep.length === new Set(indicesToKeep).size
    if (!hasNoDuplicates) {
      throw new DuplicateDiceIndicesError({
        indices: indicesToKeep
      })
    }

    if (indicesToKeep.length > 4) {
      throw new TooManyDiceKeptError({
        count: indicesToKeep.length,
        maxAllowed: 4
      })
    }

    const validIndices = indicesToKeep.every(i => i >= 0 && i < 5)
    if (!validIndices) {
      throw new InvalidDiceIndicesError({
        indices: indicesToKeep,
        validRange: [0, 4]
      })
    }

    if (!currentTurn.canRoll()) {
      throw new CantRollError({
        rollNumber: currentTurn.getRollNumber(),
        maxRolls: 3
      })
    }

    const indicesToRoll = [0, 1, 2, 3, 4].filter(i => !indicesToKeep.includes(i))
    
    const newTurn = currentTurn.nextRoll(indicesToRoll)

    return new YamsGame(
      game.getScoreBoard(),
      newTurn,
      game.getGameTurnNumber(),
      game.getValidatedTurns()
    )
  }
}