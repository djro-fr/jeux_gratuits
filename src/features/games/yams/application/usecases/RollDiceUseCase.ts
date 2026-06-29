import { YamsGame } from "../../domain/aggregates/YamsGame"

/**
 * USE CASE
 * Starts a new turn by rolling the dice.
 * Only callable when the current turn is fresh (rollNumber === 1).
 */
export class RollDiceUseCase {
  execute(input: { game: YamsGame }): YamsGame {
    const { game } = input
    if (!game.canRoll()) {
      throw new Error("Cannot roll now")
    }
    return new YamsGame(game.getScoreBoard())
  }
}