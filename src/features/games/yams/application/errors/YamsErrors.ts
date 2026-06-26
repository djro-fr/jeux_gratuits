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
export class CategoryAlreadyScoredError extends Error {
  constructor(category: string) {
    super(`CATEGORY_ALREADY_SCORED - ${category}`)
    this.name = 'categoryAlreadyScoredError'
  }
}

// infrastructure/errors/YamsErrors.ts
export class InvalidScoreDataError extends Error {
  readonly name: string = 'invalidScoreData'
  readonly details?: unknown
  constructor(details?: unknown) { super('Invalid score data'); this.details = details }
}

export class SaveScoreError extends Error {
  readonly name: string = 'saveScoreFailed'
  readonly details?: unknown
  constructor(details?: unknown) { super('Failed to save score'); this.details = details }
}

export class PlayerNameTooLongError extends Error {
  readonly name: string = 'playerNameTooLong'
  readonly details?: unknown
  constructor(details?: unknown) { super('Player name must be 10 characters or less'); this.details = details }
}

export class PlayerNameEmptyError extends Error {
  readonly name: string = 'playerNameEmpty'
  readonly details?: unknown
  constructor(details?: unknown) { super('Player name is required'); this.details = details }
}

export class InvalidScoreValueError extends Error {
  readonly name: string = 'invalidScoreValue'
  readonly details?: unknown
  constructor(details?: unknown) { super('Score cannot be negative'); this.details = details }
}

export class LeaderboardFetchError extends Error {
  readonly name: string = 'leaderboardFetchFailed'
  readonly details?: unknown
  constructor(details?: unknown) { super('Failed to fetch leaderboard'); this.details = details }
}

export class LeaderboardMapError extends Error {
  readonly name: string = 'leaderboardMapFailed'
  readonly details?: unknown
  constructor(details?: unknown) { super('Failed to map leaderboard data'); this.details = details }
}

export class LeaderboardSubscribeError extends Error {
  readonly name: string = 'leaderboardSubscribeFailed'
  readonly details?: unknown
  constructor(details?: unknown) { super('Failed to subscribe to leaderboard'); this.details = details }
}

export class LeaderboardConfigError extends Error {
  readonly name: string = 'leaderboardConfigFailed'
  readonly details?: unknown
  constructor(details?: unknown) { super('Leaderboard configuration error'); this.details = details }
}