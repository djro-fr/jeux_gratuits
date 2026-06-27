export class WrongNumberOfDiceError extends Error {
  readonly name: string = 'wrongNumberOfDiceError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Wrong number of dice')
    this.details = details
  }
}

export class DuplicateDiceIndicesError extends Error {
  readonly name: string = 'duplicateDiceIndicesError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Duplicate dice indices')
    this.details = details
  }
}

export class TooManyDiceKeptError extends Error {
  readonly name: string = 'tooManyDiceKeptError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Too many dice kept')
    this.details = details
  }
}

export class InvalidDiceIndicesError extends Error {
  readonly name: string = 'invalidDiceIndicesError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Invalid dice indices')
    this.details = details
  }
}

export class CantRollError extends Error {
  readonly name: string = 'cantRollError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Cannot roll dice')
    this.details = details
  }
}

export class CategoryAlreadyScoredError extends Error {
  readonly name: string = 'categoryAlreadyScoredError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Category already scored')
    this.details = details
  }
}

export class PlayerNameTooLongError extends Error {
  readonly name: string = 'playerNameTooLongError'
  readonly details?: unknown
  constructor(details?: unknown) { 
    super('Player name must be 10 characters or less')
    this.details = details 
  }
}

export class PlayerNameEmptyError extends Error {
  readonly name: string = 'playerNameEmptyError'
  readonly details?: unknown
  constructor(details?: unknown) { 
    super('Player name is required')
    this.details = details 
  }
}

export class InvalidPlayerNameError extends Error {
  readonly name: string = 'invalidPlayerNameError'
  readonly details?: unknown
  constructor(details?: unknown) { 
    super('Player name is wrong')
    this.details = details 
  }
}

export class InvalidScoreValueError extends Error {
  readonly name: string = 'invalidScoreValueError'
  readonly details?: unknown
  constructor(details?: unknown) { 
    super('Score cannot be negative')
    this.details = details 
  }
}
