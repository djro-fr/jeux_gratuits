import { InvalidDieValueError } from "../errors/YamsErrors"

/**
 * VALUE OBJECT
 * A single die: value (1-6) and kept state. Immutable.
 */
export class Die {
  private readonly value: number
  private readonly isKept: boolean

  constructor(value: number, isKept: boolean = false) {
    if (value < 1 || value > 6) {
      throw new InvalidDieValueError({
        received: value,
        validRange: [1, 6]
      })
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
    return new Die(Math.floor(Math.random() * 6) + 1)
  }

  toggleKeep(): Die {
    return new Die(this.value, !this.isKept)
  }
}