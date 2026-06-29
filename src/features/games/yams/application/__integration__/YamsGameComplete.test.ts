import { Die } from "../../domain/valueObjects/Die"
import { DiceRoll } from "../../domain/valueObjects/DiceRoll"
import { YamsTurn } from "../../domain/valueObjects/YamsTurn"
import { YamsGame } from "../../domain/aggregates/YamsGame"
import { calculateTotalScore, YamsCategory } from "../../domain/rules/calculateScore"
import { RecordScoreUseCase } from "../usecases/RecordScoreUseCase"

describe('Integration: YamsGameFlow - Complete game', () => {
  it('Should complete full game and calculate final score', () => {
    const scoreUseCase = new RecordScoreUseCase()
        
    const dice1 = [new Die(1), new Die(1), new Die(3), new Die(4), new Die(5)]
    const roll1 = new DiceRoll(dice1)
    const turn1 = new YamsTurn(1, roll1)
    let game = new YamsGame(undefined, turn1)
        
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.Ones
    })
    
    expect(game.getScoreBoard().getScore(YamsCategory.Ones)).not.toBeNull()
    expect(game.getScoreBoard().getScore(YamsCategory.Ones)).toBe(2) // 1+1
    
    const finalScore = calculateTotalScore(game.getScoreBoard().getAllScores())
    expect(finalScore).toBeGreaterThan(0)
  })
})