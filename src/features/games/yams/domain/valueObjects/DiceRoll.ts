import { Die } from "./Die";

/**
 * VALUE OBJECT
 * Represents a collection of 5 dice with keep/reroll operations.
 * 
 * Responsibilities:
 * - Maintain the state of all dice
 * - Toggle keep state for individual dice
 * - Reroll selected dice
 * 
 * Immutable: each operation returns a new instance.
 * No identity, compared by value.
 */
export class DiceRoll {

  private readonly dice: Die[] = []  

  constructor(dice?: Die[]){
    this.dice = dice || Array.from({ length: 5}, () => Die.generateRandom())
  }

  getDice(): Die[]{    
    return [...this.dice]
  }

  toggleKeep(index: number): DiceRoll {    
    const newDice = this.dice.map((die, i) => 
      i === index ? die.toggleKeep() : die
    )    
    return new DiceRoll(newDice)
  }

  reroll(indices : number[]) : DiceRoll {
    const newDice = this.dice.map((die, i) => 
      (indices.includes(i) && !die.isKeptDie()) ? Die.generateRandom() : die    
    )    
    return new DiceRoll(newDice)
  }

}