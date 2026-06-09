export class InvalidDieValueError extends Error {
  constructor() {
    super('INVALID_DIE_VALUE')
    this.name = 'invalidDieValueError'
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
