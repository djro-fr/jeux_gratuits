import { DiceRoll } from "./DiceRoll"
import { MaxTurnsReachedError } from "../errors/YamsErrors"

/**
 * VALUE OBJECT
 * Represents a single turn with up to 3 rolls.
 * 
 * Responsibilities:
 * - Track current roll number
 * - Manage the current dice state (DiceRoll)
 * - Control reroll availability
 * 
 * Immutable: each operation returns a new instance.
 * No identity, compared by value.
 */
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
