import { DiceRoll } from "../../domain/entities/DiceRoll";
import { Die } from "../../domain/entities/Die";
import { WrongNumberOfDice } from "../errors/YamsErrors";


export class RollDiceUseCase {
  execute(numberOfDice: number = 5): DiceRoll {
    if (numberOfDice < 1 || numberOfDice > 5) {
      throw new WrongNumberOfDice(numberOfDice)
    }
    const dice = Array.from(
      { length: numberOfDice }, 
      () => Die.generateRandom()
    )
    return new DiceRoll(dice)
  }
}