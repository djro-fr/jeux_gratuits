export class Dice {
  readonly value: number
  readonly isKept: boolean

  constructor(value: number, isKept: boolean = false) {
    if (value < 1 || value > 6) {
      throw new Error('INVALID_DICE_VALUE')
    }
    this.value = value
    this.isKept = isKept
  }

  keep(): Dice {
    return new Dice(this.value, true)
  }

  release(): Dice {
    return new Dice(this.value, false)
  }
}