import { InvalidDiceValueError } from "../errors/YamsErrors"

export class Dice {
  readonly value: number
  readonly isKept: boolean

  constructor(value: number, isKept: boolean = false) {
    if (value < 1 || value > 6) {
      throw new InvalidDiceValueError()
    }
    this.value = value
    this.isKept = isKept
  }

  static generateRandom(): Dice {
    return new Dice(Math.round(Math.random()*5+1))
  }

  toggleKeep(): Dice {
    return new Dice(this.value, !this.isKept)
  }
}