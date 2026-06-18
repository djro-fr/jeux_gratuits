import { YamsCategory } from "../../domain/rules/calculateScore"

export class YamsScoreBoard {
  private readonly scores: Record<YamsCategory, number | null>

  private constructor(scores: Record<YamsCategory, number | null>) {
    this.scores = scores
  }
  
  static create(): YamsScoreBoard {
    const emptyScores = Object.fromEntries(
      Object.values(YamsCategory).map(category => [category, null])
    ) as Record<YamsCategory, number | null>
    
    return new YamsScoreBoard(emptyScores)
  }

  canScore(category: YamsCategory): boolean {
    return this.scores[category] === null
  }

  addScore(category: YamsCategory, value: number): YamsScoreBoard {
    return new YamsScoreBoard({
      ...this.scores, [category] : value
    })
  }

  getScore(category: YamsCategory): number | null {
    return this.scores[category]
  }

  getAllScores(): Record<YamsCategory, number | null> {
    return { ...this.scores }
  }

}