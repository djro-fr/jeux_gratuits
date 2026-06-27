import { DiceRoll } from "./DiceRoll"
import { MaxTurnsReachedError } from "../errors/YamsErrors"

export class YamsTurn {
  private readonly rollNumber: number
  private readonly diceRoll: DiceRoll

  constructor(rollNumber: number = 1, diceRoll?: DiceRoll) {
    this.rollNumber = rollNumber
  
    this.diceRoll = diceRoll || new DiceRoll()
  
  }

  getRollNumber() : number {
    return this.rollNumber
  }

  getDiceRoll(): DiceRoll {
    return this.diceRoll
  }
  
  canRoll(): boolean {
    return this.rollNumber < 3        
  }

  nextRoll(indicesToRoll?: number[]): YamsTurn {
    if (!this.canRoll()) {
      throw new MaxTurnsReachedError({
        currentRollNumber: this.rollNumber,
        maxRolls: 3
      })
    }
    const newDiceRoll = indicesToRoll 
      ? this.diceRoll.reroll(indicesToRoll)
      : new DiceRoll()
    
    return new YamsTurn(this.rollNumber + 1, newDiceRoll)    
  }
}
