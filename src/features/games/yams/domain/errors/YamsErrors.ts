export class InvalidDieValueError extends Error {
  readonly name: string = 'invalidDieValueError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Invalid die value')
    this.details = details
  }
}

export class MaxTurnsReachedError extends Error {
  readonly name: string = 'maxTurnsReachedError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Maximum turns reached')
    this.details = details
  }
}

export class GameAlreadyFinishedError extends Error {
  readonly name: string = 'gameAlreadyFinishedError'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Game is already finished')
    this.details = details
  }
}