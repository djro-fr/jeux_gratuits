import { WrongNumberOfDiceError } from "../errors/YamsErrors"
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
      expect(() => rollDiceUseCase.execute(0)).toThrow(WrongNumberOfDiceError)
    })
    it("1.4) with 6 dice throws WrongNumberOfDice error", () => {        
      expect(() => rollDiceUseCase.execute(6)).toThrow(WrongNumberOfDiceError)
    })
    it("1.5) should generate random dice with values 1-6", () => {
      const rollDice = rollDiceUseCase.execute(5)
      const diceValues = rollDice.getDice().map(die => die.getValue())
      
      diceValues.forEach(value => {
        expect(value).toBeGreaterThanOrEqual(1)
        expect(value).toBeLessThanOrEqual(6)
      })
    })
    
  })
})
      