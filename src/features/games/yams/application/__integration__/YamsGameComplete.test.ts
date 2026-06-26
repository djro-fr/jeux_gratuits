import { Die } from "../../domain/entities/Die"
import { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import { calculateTotalScore, YamsCategory } from "../../domain/rules/calculateScore"
import { ScoreTurnUseCase } from "../usecases/ScoreTurnUseCase"

describe('Integration: YamsGameFlow - Complete game', () => {
  it('Should complete full game and calculate final score', () => {
    let scoreBoard = YamsScoreBoard.create()
    
    const result1 = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard,
      dice: [new Die(1), new Die(1), new Die(3), new Die(4), new Die(5)],
      category: YamsCategory.Ones
    })
    scoreBoard = result1.updatedScoreBoard
   
    const finalScore = calculateTotalScore(scoreBoard.getAllScores())
    expect(finalScore).toBeGreaterThan(0)
    expect(scoreBoard.getScore(YamsCategory.Ones)).not.toBe(null)
  })
})