export class InvalidScoreDataError extends Error {
  readonly name: string = 'invalidScoreData'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Invalid score data')
    this.details = details
  }
}

export class SaveScoreError extends Error {
  readonly name: string = 'saveScoreFailed'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Failed to save score')
    this.details = details
  }
}

export class LeaderboardFetchError extends Error {
  readonly name: string = 'leaderboardFetchFailed'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Failed to fetch leaderboard')
    this.details = details
  }
}

export class LeaderboardMapError extends Error {
  readonly name: string = 'leaderboardMapFailed'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Failed to map leaderboard data')
    this.details = details
  }
}

export class LeaderboardSubscribeError extends Error {
  readonly name: string = 'leaderboardSubscribeFailed'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Failed to subscribe to leaderboard')
    this.details = details
  }
}

export class LeaderboardConfigError extends Error {
  readonly name: string = 'leaderboardConfigFailed'
  readonly details?: unknown

  constructor(details?: unknown) {
    super('Leaderboard configuration error')
    this.details = details
  }
}