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
export class ImpossibleScoreError extends Error {
  constructor(category: string) {
    super(`IMPOSSIBLE_SCORE - ${category}`)
    this.name = 'impossibleScoreError'
  }
}