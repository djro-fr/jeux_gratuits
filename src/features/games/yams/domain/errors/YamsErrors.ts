export class InvalidDiceValueError extends Error {
  constructor() {
    super('INVALID_DICE_VALUE')
    this.name = 'InvalidDiceValueError'
  }
}
export class MaxTurnsReachedError extends Error {
  constructor() {
    super('MAX_TURNS_REACHED')
    this.name = 'MaxTurnsReachedError'
  }
}