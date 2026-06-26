import { DiceRoll } from "../../domain/entities/DiceRoll"
import { Die } from "../../domain/entities/Die"
import { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import { YamsTurn } from "../../domain/entities/YamsTurn"
import { YamsCategory } from "../../domain/rules/calculateScore"

import { KeepDiceUseCase } from "../usecases/KeepDiceUseCase"
import { RollDiceUseCase } from "../usecases/RollDiceUseCase"
import { ScoreTurnUseCase } from "../usecases/ScoreTurnUseCase"

describe("Integration: YamsGameFlow - One complete turn", () => {
  it("1) Should complete one turn: start → roll → score", () => {
    
    const roll = new RollDiceUseCase().execute(5)

    const scoreBoard = YamsScoreBoard.create()
    const dice = roll.getDice()
    const scoreResult = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard,
      dice: dice,
      category: YamsCategory.Chance
    })

    expect(roll.getDice().length).toBe(5)    
    expect(scoreResult.scoreEarned).toBeGreaterThan(0)
    expect(scoreResult.updatedScoreBoard.getScore(YamsCategory.Chance)).not.toBe(null)
    expect(scoreResult.updatedScoreBoard).not.toBe(scoreBoard)
  })
  it("2) Should complete two turns with score accumulation", () => {
    
    const scoreBoard1 = YamsScoreBoard.create()
    const dice1 = [new Die(1), new Die(1), new Die(3), new Die(4), new Die(5)]    
    const scoreResult1 = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard1,
      dice: dice1,
      category: YamsCategory.Ones
    })

    const scoreBoard2 = scoreResult1.updatedScoreBoard
    const dice2 = [new Die(2), new Die(2), new Die(4), new Die(5), new Die(6)]    
    const scoreResult2 = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard2,
      dice: dice2,
      category: YamsCategory.Twos
    })

    const scoreBoard3 = scoreResult2.updatedScoreBoard

    expect(scoreResult1.scoreEarned).toBeGreaterThan(0)      
    expect(scoreResult2.scoreEarned).toBeGreaterThan(0)
    expect(scoreBoard3.getScore(YamsCategory.Ones)).not.toBe(null)    
    expect(scoreBoard3.getScore(YamsCategory.Twos)).not.toBe(null)    
    expect(scoreBoard3).not.toBe(scoreBoard1)
  })
  it("3) Should complete one turn with keep and reroll", () => {

    const scoreBoard = YamsScoreBoard.create()
    const roll1 = new DiceRoll([new Die(1), new Die(1), new Die(3), new Die(4), new Die(5)])      
    const turn1 = new YamsTurn(1, roll1)  
    
    const turn2 = new KeepDiceUseCase().execute(turn1, [0, 1])
    const roll2 = turn2.getDiceRoll()

    const finalDice = roll2.getDice()

    const result = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard,
      dice: finalDice,
      category: YamsCategory.Chance
    })

    const scoreBoard2 = result.updatedScoreBoard

    expect(finalDice.length).toBe(5)
    expect(result.scoreEarned).toBeGreaterThan(0)      
    expect(scoreBoard2.getScore(YamsCategory.Chance)).toBeGreaterThan(0)   
  })
  it("4) Should apply Yahtzee bonus on second Yahtzee roll", () => {    
    const scoreBoard1 = YamsScoreBoard.create()
    const yahtzee1 = [new Die(5), new Die(5), new Die(5), new Die(5), new Die(5)]
    const result1 = new ScoreTurnUseCase().execute({
      yamsScoreBoard: scoreBoard1,
      dice: yahtzee1,
      category: YamsCategory.Yahtzee
    })
    
    expect(result1.scoreEarned).toBe(50)
    expect(result1.updatedScoreBoard.getTotalYahtzeeBonus()).toBe(0)
        
    const yahtzee2 = [new Die(3), new Die(3), new Die(3), new Die(3), new Die(3)]
    const result2 = new ScoreTurnUseCase().execute({
      yamsScoreBoard: result1.updatedScoreBoard,
      dice: yahtzee2,
      category: YamsCategory.FourOfAKind  
    })
    
    expect(result2.scoreEarned).toBe(115) 
    expect(result2.updatedScoreBoard.getTotalYahtzeeBonus()).toBe(100)
  })
})