import { KeepDiceUseCase } from "./KeepDiceUseCase"
import { YamsGame } from "../../domain/aggregates/YamsGame"
import { YamsTurn } from "../../domain/valueObjects/YamsTurn"
import { CantRollError, DuplicateDiceIndicesError, InvalidDiceIndicesError, TooManyDiceKeptError } from "../errors/YamsErrors"


describe("Application unit tests (KeepDiceUseCase)", () => {
  describe("1) Valid reroll", () => {
    it("1.1) with valid indices returns updated game", () => {
      const useCase = new KeepDiceUseCase()
      const game = new YamsGame()
      
      const result = useCase.execute({
        game,
        indicesToKeep: [0, 1, 2, 3]
      })
      
      expect(result).not.toBe(game)
      expect(result.getCurrentTurn().getRollNumber()).toBe(2)
    })
    
    it("1.2) keeps specified indices and rerolls others", () => {
      const useCase = new KeepDiceUseCase()
      const game = new YamsGame()
      const originalDice = game.getCurrentTurn().getDiceRoll().getDice()
      
      const result = useCase.execute({
        game,
        indicesToKeep: [0, 1]
      })
      
      const resultDice = result.getCurrentTurn().getDiceRoll().getDice()
      
      expect(resultDice[0]).toBe(originalDice[0])
      expect(resultDice[1]).toBe(originalDice[1])
      expect(resultDice[2]).not.toBe(originalDice[2])
    })
  })
  
  describe("2) Error handling", () => {
    it("2.1) with duplicate indices throws DuplicateDiceIndicesError", () => {
      const useCase = new KeepDiceUseCase()
      const game = new YamsGame()
      
      expect(() => {
        useCase.execute({ game, indicesToKeep: [0, 0, 1] })
      }).toThrow(DuplicateDiceIndicesError)
    })
    
    it("2.2) with more than 4 indices throws TooManyDiceKeptError", () => {
      const useCase = new KeepDiceUseCase()
      const game = new YamsGame()
      
      expect(() => {
        useCase.execute({ game, indicesToKeep: [0, 1, 2, 3, 4] })
      }).toThrow(TooManyDiceKeptError)
    })
    
    it("2.3) with invalid indices throws InvalidDiceIndicesError", () => {
      const useCase = new KeepDiceUseCase()
      const game = new YamsGame()
      
      expect(() => {
        useCase.execute({ game, indicesToKeep: [-1, 1] })
      }).toThrow(InvalidDiceIndicesError)
    })
    
    it("2.4) when rollNumber === 3 throws CantRollError", () => {
      const useCase = new KeepDiceUseCase()
      const turn3 = new YamsTurn(3)
      const game = new YamsGame(undefined, turn3)
      
      expect(() => {
        useCase.execute({ game, indicesToKeep: [0, 1] })
      }).toThrow(CantRollError)
    })
  })
})