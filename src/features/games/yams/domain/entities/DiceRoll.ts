import { Die } from "./Die";

export class DiceRoll {

  private readonly dice: Die[] = []  

  constructor(dice?: Die[]){
    this.dice = dice || Array.from({ length: 5}, () => Die.generateRandom())
  }

  getDice(): Die[]{
    // immutable, copy
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