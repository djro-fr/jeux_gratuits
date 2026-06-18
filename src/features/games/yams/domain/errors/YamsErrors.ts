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
export class WrongNumberOfDice extends Error {
  constructor(numberOfDice: number) {
    super(`WRONG_NUMBER_OF_DICE - ${numberOfDice}`)
    this.name = 'wrongNumberOfDice'
  }
}  
export class DuplicateDiceIndicesError extends Error {
  constructor() {
    super('DUPLICATE_DICE_INDICES')
    this.name = 'duplicateDiceIndicesError'
  }
}  
export class TooManyDiceKeptError extends Error {
  constructor(count: number) {
    super(`TOO_MANY_DICE_KEPT - ${count}`)
    this.name = 'tooManyDiceKeptError'
  }
}
export class InvalidDiceIndicesError extends Error {
  constructor() {
    super('INVALID_DICE_INDICES')
    this.name = 'invalidDiceIndicesError'
  }
}  
export class CantRollError extends Error {
  constructor() {
    super('CANT_ROLL')
    this.name = 'cantRollError'
  }
}  

