import type { YamsCategory } from "../rules/calculateScore"
import { CategoryAlreadyScoredError, GameAlreadyFinishedError } from "../errors/YamsErrors"
import { Die } from "../valueObjects/Die"
import { YamsScoreBoard } from "../valueObjects/YamsScoreBoard"
import { YamsTurn } from "../valueObjects/YamsTurn"

/**
 * AGGREGATE ROOT
 * Orchestrates a complete Yams game: scoreBoard, turns, validations.
 * Immutable. Single entry point for modifying the entire game state.
 */
export class YamsGame{
  private readonly scoreBoard: YamsScoreBoard 
  private readonly currentTurn: YamsTurn
  private readonly gameTurnNumber: number
  private readonly validatedTurns: { turn: YamsTurn, finalDice: Die[] }[] 

  constructor(
    scoreBoard?: YamsScoreBoard, 
    yamsTurn?: YamsTurn, 
    gameTurnNumber: number = 1, 
    validatedTurns?: { turn: YamsTurn, finalDice: Die[] }[] 
  ){    
    this.scoreBoard = scoreBoard || YamsScoreBoard.create()
    this.currentTurn = yamsTurn || new YamsTurn()
    this.gameTurnNumber = gameTurnNumber
    this.validatedTurns = validatedTurns || []
  }

  getScoreBoard(): YamsScoreBoard {
    return this.scoreBoard
  }

  getCurrentTurn() : YamsTurn {
    return this.currentTurn
  }

  getGameTurnNumber(): number {
    return this.gameTurnNumber
  }

  getValidatedTurns() : { turn: YamsTurn, finalDice: Die[] }[] {
    return [...this.validatedTurns]
  }

  validateTurn(finalDice: Die[]) : YamsGame{
    if (this.isGameFinished()) {
      throw new GameAlreadyFinishedError({
        turnsCompleted: this.validatedTurns.length,
        maxTurns: 13,
        currentTurnNumber: this.gameTurnNumber
      })
    }
    const newValidatedTurns = [
      ...this.validatedTurns,
      { turn: this.currentTurn, finalDice: finalDice }
    ]
    
    const isFinalTurn = newValidatedTurns.length >= 13
    const newGameTurnNumber = isFinalTurn 
      ? this.gameTurnNumber 
      : this.gameTurnNumber + 1
    
    const newTurn = isFinalTurn 
      ? this.currentTurn 
      : new YamsTurn()
  
    return new YamsGame(this.getScoreBoard(), newTurn, newGameTurnNumber, newValidatedTurns)
  }

  isGameFinished() : boolean {
    return this.validatedTurns.length >= 13
  }

  recordScore(category: YamsCategory, score: number): YamsGame {
    if (!this.scoreBoard.canScore(category)) {
      throw new CategoryAlreadyScoredError({
        category,
        currentScore: this.scoreBoard.getScore(category)
      })
    }
    
    const updatedScoreBoard = this.scoreBoard.addScore(category, score)
    
    const gameWithScore = new YamsGame(
      updatedScoreBoard,
      this.currentTurn,
      this.gameTurnNumber,
      this.validatedTurns
    )
    
    return gameWithScore.validateTurn(
      this.currentTurn.getDiceRoll().getDice()
    )
  }

  canRoll(): boolean {
    return !this.isGameFinished() && 
           this.currentTurn.getRollNumber() === 1
  }

  canReroll(): boolean {
    return this.currentTurn.getRollNumber() > 1 && 
           this.currentTurn.getRollNumber() < 3
  }

  canScore(): boolean {
    return this.currentTurn.getRollNumber() >= 1
  }
}

