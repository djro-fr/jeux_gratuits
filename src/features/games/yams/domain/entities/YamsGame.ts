import { GameAlreadyFinishedError } from "../errors/YamsErrors"
import type { Die } from "./Die"
import { YamsTurn } from "./YamsTurn"

export class YamsGame{
  private readonly currentTurn: YamsTurn
  private readonly gameTurnNumber: number
  private readonly validatedTurns: { turn: YamsTurn, finalDice: Die[] }[] 

  constructor(yamsTurn?: YamsTurn, gameTurnNumber: number = 1, validatedTurns?: { turn: YamsTurn, finalDice: Die[] }[] ){
    this.currentTurn = yamsTurn || new YamsTurn()
    this.gameTurnNumber = gameTurnNumber
    this.validatedTurns = validatedTurns || []
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
      throw new GameAlreadyFinishedError()
    }
    const newValidatedTurns = [
      ...this.validatedTurns,
      { turn: this.currentTurn, finalDice: finalDice }
    ]
    
    const newGameTurnNumber = (newValidatedTurns.length < 13)
    ? this.gameTurnNumber + 1
    : this.gameTurnNumber 
  
  const newTurn = (newValidatedTurns.length < 13)
    ? new YamsTurn()
    : this.currentTurn 
  
    return new YamsGame(newTurn, newGameTurnNumber, newValidatedTurns)
  }

  isGameFinished() : boolean {
    return this.validatedTurns.length >= 13
  }
}

