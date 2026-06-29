
import { YamsGame } from "../../domain/aggregates/YamsGame"
import { YamsCategory } from "../../domain/rules/calculateScore"
import { CategoryAlreadyScoredError } from "../../domain/errors/YamsErrors"
import { RecordScoreUseCase } from "./RecordScoreUseCase"


describe("Application unit tests (RecordScoreUseCase)", () => {
  describe("1) Valid score recording", () => {
    it("1.1) should record score in a fresh game", () => {
      const useCase = new RecordScoreUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({
        game,
        category: YamsCategory.Ones
      })
      
      expect(result.getScoreBoard().getScore(YamsCategory.Ones)).not.toBeNull()
      expect(result).not.toBe(game) 
    })
    
    it("1.2) should advance to next turn after scoring", () => {
      const useCase = new RecordScoreUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({
        game,
        category: YamsCategory.Ones
      })
      
      expect(result.getGameTurnNumber()).toBe(2)
      expect(result.getCurrentTurn().getRollNumber()).toBe(1)
    })
  })
  
  describe("2) Error handling", () => {
    it("2.1) should throw if category already scored", () => {
      const useCase = new RecordScoreUseCase()
      let game = new YamsGame()

      game = useCase.execute({ game, category: YamsCategory.Ones })
      
      expect(() => {
        useCase.execute({ game, category: YamsCategory.Ones })
      }).toThrow(CategoryAlreadyScoredError)
    })
  })
})