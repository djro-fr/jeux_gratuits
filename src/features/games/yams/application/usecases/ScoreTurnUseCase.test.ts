import { Die } from "../../domain/entities/Die"
import { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import { YamsCategory } from "../../domain/rules/calculateScore"

import { CategoryAlreadyScoredError} from "../errors/YamsErrors"
import { ScoreTurnUseCase } from "./ScoreTurnUseCase"

describe("Application unit tests (ScoreTurnUseCase)", () => {
  
  const useCase = new ScoreTurnUseCase()
  
  describe("1) Valid scoring", () => {
    it("1.1) scores a valid category with dice", () => {
      const scoreBoard = YamsScoreBoard.create()
      const dice = [new Die(1), new Die(1), new Die(1), new Die(1), new Die(1)]
      const result = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: dice,
        category: YamsCategory.Yahtzee
      })

      expect(result.scoreEarned).toBe(50)
      expect(result.updatedScoreBoard.getScore(YamsCategory.Yahtzee)).toBe(50)
    })
  })
  describe("2) Error handling", () => {
    it("2.1) throws CategoryAlreadyScoredError if category already scored", () => {
      const scoreBoard = YamsScoreBoard.create().addScore(YamsCategory.Ones, 5)
      const dice = [new Die(1), new Die(2), new Die(3), new Die(4), new Die(5)]
      expect(() => useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: dice,
        category: YamsCategory.Ones
      })).toThrow(CategoryAlreadyScoredError)
    })
  })
  describe("3) Yahtzee bonus", () => {
    it("3.1) adds 100 bonus if Yahtzee filled at 50", () => {
      const scoreBoard = YamsScoreBoard.create().addScore(YamsCategory.Yahtzee, 50)
      const dice = [new Die(5), new Die(5), new Die(5), new Die(5), new Die(5)]
      const result = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: dice,
        category: YamsCategory.FourOfAKind
      })
      expect(result.scoreEarned).toBe(125)
      expect(result.updatedScoreBoard.getTotalYahtzeeBonus()).toBe(100)
    })
    
    it("3.2) accumulates 200 total bonus when rolling two Yahtzees", () => {
      const scoreBoard = YamsScoreBoard.create().addScore(YamsCategory.Yahtzee, 50)
      const dice = [new Die(4), new Die(4), new Die(4), new Die(4), new Die(4)]
      const result1 = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: dice,
        category: YamsCategory.ThreeOfAKind
      })      
      expect(result1.scoreEarned).toBe(120) 
      expect(result1.updatedScoreBoard.getTotalYahtzeeBonus()).toBe(100)
      const result2 = useCase.execute({
        yamsScoreBoard: result1.updatedScoreBoard,
        dice: dice,
        category: YamsCategory.Fours
      })
      expect(result2.scoreEarned).toBe(120)
      expect(result2.updatedScoreBoard.getTotalYahtzeeBonus()).toBe(200)
    })
  })
  
  describe("4) Immutability", () => {
    it("4.1) returns a new scoreBoard instance", () => {
      const scoreBoard = YamsScoreBoard.create()
      const dice = [new Die(4), new Die(4), new Die(4), new Die(4), new Die(4)]
      const result = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: dice,
        category: YamsCategory.ThreeOfAKind
      })      
      expect(result.updatedScoreBoard).not.toBe(scoreBoard)
      expect(scoreBoard.getScore(YamsCategory.ThreeOfAKind)).toBe(null)
      expect(result.updatedScoreBoard.getScore(YamsCategory.ThreeOfAKind)).not.toBe(null)      
      expect(result.updatedScoreBoard.getScore(YamsCategory.ThreeOfAKind)).toBe(20)
    })
  })

  describe("5) Multi-step integration", () => {
    it("5.1) preserves state across multiple operations", () => {
      let scoreBoard = YamsScoreBoard.create()

      const result1 = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: [new Die(1), new Die(1), new Die(2), new Die(3), new Die(4)],
        category: YamsCategory.Ones
      })
      scoreBoard = result1.updatedScoreBoard
      
      const result2 = useCase.execute({
        yamsScoreBoard: scoreBoard,
        dice: [new Die(1), new Die(2), new Die(2), new Die(2), new Die(4)],
        category: YamsCategory.Twos
      })
      scoreBoard = result2.updatedScoreBoard
     
      expect(scoreBoard.getScore(YamsCategory.Ones)).toBe(2)
      expect(scoreBoard.getScore(YamsCategory.Twos)).toBe(6)
    })
  })
})
  