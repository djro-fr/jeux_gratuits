import { YamsGame } from "../../domain/aggregates/YamsGame"
import { YamsTurn } from "../../domain/valueObjects/YamsTurn"
import { RollDiceUseCase } from "./RollDiceUseCase"

describe("Application unit tests (RollDiceUseCase)", () => {
  describe("1) Valid roll", () => {
    it("1.1) should start new turn and return updated game", () => {
      const useCase = new RollDiceUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({ game })
      
      expect(result.getCurrentTurn().getRollNumber()).toBe(1)
      expect(result).not.toBe(game)
    })
    
    it("1.2) should preserve scoreBoard", () => {
      const useCase = new RollDiceUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({ game })
      
      expect(result.getScoreBoard()).toBe(game.getScoreBoard())
    })
    
    it("1.3) should reset to fresh state", () => {
      const useCase = new RollDiceUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({ game })
      
      expect(result.getGameTurnNumber()).toBe(1)
      expect(result.getValidatedTurns()).toHaveLength(0)
    })
  })
  
  describe("2) Guard: can only roll when turn is fresh", () => {
    it("2.1) should throw if turn already started", () => {
      const useCase = new RollDiceUseCase()
      const turn2 = new YamsTurn(2)
      const game = new YamsGame(undefined, turn2)
      
      expect(() => {
        useCase.execute({ game })
      }).toThrow()
    })
    
    it("2.2) should throw if game finished", () => {
      const useCase = new RollDiceUseCase()
      let game = new YamsGame()
      
      for (let i = 0; i < 13; i++) {
        game = game.validateTurn(game.getCurrentTurn().getDiceRoll().getDice())
      }
      
      expect(() => {
        useCase.execute({ game })
      }).toThrow()
    })
  })
})