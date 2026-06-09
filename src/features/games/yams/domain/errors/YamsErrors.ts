export class InvalidDiceValueError extends Error {
  constructor() {
    super('INVALID_DICE_VALUE')
    this.name = 'invalidDiceValueError'
  }
}
export class MaxTurnsReachedError extends Error {
  constructor() {
    super('MAX_TURNS_REACHED')
    this.name = 'maxTurnsReachedError'
  }
}
export class GameAlreadyFinishedError extends Error {
  constructor() {
    super('GAME_ALREADY_FINISHED')
    this.name = 'gameAlreadyFinishedError'
  }
}  
