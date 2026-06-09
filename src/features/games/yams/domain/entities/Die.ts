import { InvalidDieValueError } from "../errors/YamsErrors"

export class Die {
  private readonly value: number
  private readonly isKept: boolean

  constructor(value: number, isKept: boolean = false) {
    if (value < 1 || value > 6) {
      throw new InvalidDieValueError()
    }
    this.value = value
    this.isKept = isKept
  }
  
  getValue(): number {
    return this.value
  }
  
  isKeptDie(): boolean {
    return this.isKept
  }

  static generateRandom(): Die {
    return new Die(Math.round(Math.random()*5+1))
  }

  toggleKeep(): Die {
    return new Die(this.value, !this.isKept)
  }
}