
import { CategoryAlreadyScoredError } from "../../application/errors/YamsErrors"
import { YamsCategory } from "../../domain/rules/calculateScore"


export class YamsScoreBoard {
  private readonly scores: Record<YamsCategory, number | null>
  private readonly totalYahtzeeBonus: number 

  private constructor(
    scores: Record<YamsCategory, number | null>, 
    totalYahtzeeBonus: number = 0
  ) {
    this.scores = scores    
    this.totalYahtzeeBonus = totalYahtzeeBonus
  }

  
  static create(totalYahtzeeBonus: number = 0): YamsScoreBoard {
    const emptyScores = Object.fromEntries(
      Object.values(YamsCategory).map(category => [category, null])
    ) as Record<YamsCategory, number | null>
    
    return new YamsScoreBoard(emptyScores, totalYahtzeeBonus)
  }

  canScore(category: YamsCategory): boolean {
    return this.scores[category] === null
  }

  addScore(category: YamsCategory, score: number): YamsScoreBoard {
    if (!this.canScore(category)) throw new CategoryAlreadyScoredError(category)
    const newScores = { ...this.scores, [category]: score }
    return new YamsScoreBoard(newScores, this.totalYahtzeeBonus)
  }

  addYahtzeeBonus(amount: number): YamsScoreBoard {
    return new YamsScoreBoard(this.scores, this.totalYahtzeeBonus + amount)
  }

  getTotalYahtzeeBonus(): number {
    return this.totalYahtzeeBonus
  }

  getScore(category: YamsCategory): number | null {
    return this.scores[category]
  }

  getAllScores(): Record<YamsCategory, number | null> {
    return { ...this.scores }
  }

}