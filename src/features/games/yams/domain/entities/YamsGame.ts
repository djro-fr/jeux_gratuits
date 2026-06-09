import { GameAlreadyFinishedError } from "../errors/YamsErrors"
import type { Dice } from "./Dice"
import { YamsTurn } from "./YamsTurn"

export class YamsGame{
  private readonly currentTurn: YamsTurn
  private readonly gameTurnNumber: number
  private readonly validatedTurns: { turn: YamsTurn, finalDice: Dice[] }[] 

  constructor(yamsTurn?: YamsTurn, gameTurnNumber: number = 1, validatedTurns?: { turn: YamsTurn, finalDice: Dice[] }[] ){
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

  getValidatedTurns() : { turn: YamsTurn, finalDice: Dice[] }[] {
    return [...this.validatedTurns]
  }

  validateTurn(finalDice: Dice[]) : YamsGame{
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

