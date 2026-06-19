import { YamsTurn } from "../../domain/entities/YamsTurn"
import { CantRollError, DuplicateDiceIndicesError, InvalidDiceIndicesError, TooManyDiceKeptError } from "../errors/YamsErrors"
import { KeepDiceUseCase } from "./KeepDiceUseCase"

describe("Application unit tests (KeepDiceUseCase)", () => {
  describe("1) execute", () => {
    let keepDiceUseCase: KeepDiceUseCase
    let turn : YamsTurn

    beforeEach(() => {
      turn  = new YamsTurn()
      keepDiceUseCase = new KeepDiceUseCase()    
    })
    it("1.1) with valid indices returns updated turn", () => {
      const indices = [0,1,2,3]
      const result = keepDiceUseCase.execute(turn, indices)
      expect(result).toBeInstanceOf(YamsTurn)   
      expect(result).not.toBe(turn)
      expect(result.getRollNumber()).toBe(2)

    })
    it("1.2) with duplicate indices throws DuplicateDiceIndicesError", () => {        
      const indices = [0,1,2,1]      
      expect(() => keepDiceUseCase.execute(turn, indices)).toThrow(DuplicateDiceIndicesError)
    })
    it("1.3) with more than 4 indices throws TooManyDiceKeptError", () => {              
      const indices = [0,1,2,3,4]      
      expect(() => keepDiceUseCase.execute(turn, indices)).toThrow(TooManyDiceKeptError)
    })
    it("1.4) with invalid indices throws InvalidDiceIndicesError", () => {        
      const indices = [-1,1,2,3]   
      expect(() => keepDiceUseCase.execute(turn, indices)).toThrow(InvalidDiceIndicesError)
    })
    it("1.5) turn number >3 throws CantRollError", () => {
      const turn2 = turn.nextRoll()
      const turn3 = turn2.nextRoll()
      const indices = [0,1,2,3]   
      expect(() => keepDiceUseCase.execute(turn3, indices)).toThrow(CantRollError)
    })
  })
})
      