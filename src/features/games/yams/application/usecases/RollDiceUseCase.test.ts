import { WrongNumberOfDice } from "../errors/YamsErrors"
import { RollDiceUseCase } from "./RollDiceUseCase"

describe("Application unit tests (RollDiceUseCase)", () => {
  describe("1) execute", () => {
    let rollDiceUseCase: RollDiceUseCase

    beforeEach(() => {
      rollDiceUseCase = new RollDiceUseCase()
    })
    it("1.1) without arguments returns Diceroll with 5 dice", () => {
      const rollDice = rollDiceUseCase.execute()  
      expect(rollDice.getDice().length).toBe(5)
    })
    it("1.2) with 3 dice returns Diceroll with 3 dice", () => {
      const rollDice = rollDiceUseCase.execute(3)  
      expect(rollDice.getDice().length).toBe(3)
    })
    it("1.3) with 0 dice throws WrongNumberOfDice error", () => {        
      expect(() => rollDiceUseCase.execute(0)).toThrow(WrongNumberOfDice)
    })
    it("1.4) with 6 dice throws WrongNumberOfDice error", () => {        
      expect(() => rollDiceUseCase.execute(6)).toThrow(WrongNumberOfDice)
    })
  })
})
      