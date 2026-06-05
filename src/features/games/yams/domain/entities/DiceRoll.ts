import { Dice } from "./Dice";

export class DiceRoll {

  private readonly dices: Dice[] = []  

  constructor(dices?: Dice[]){
    this.dices = dices || Array.from({ length: 5}, () => Dice.generateRandom())
  }

  getDices(): Dice[]{
    // immutable, copy
    return [...this.dices]
  }

  toggleKeep(index: number): DiceRoll {    
    const newDices = this.dices.map((dice, i) => 
      i === index ? dice.toggleKeep() : dice
    )    
    return new DiceRoll(newDices)
  }

  reroll(indices : number[]) : DiceRoll {
    const newDices = this.dices.map((dice, i) => 
      (indices.includes(i) && !dice.isKeptDice()) ? Dice.generateRandom() : dice    
    )    
    return new DiceRoll(newDices)
  }

}