import { MaxTurnsReachedError } from "../errors/YamsErrors"
import { DiceRoll } from "./DiceRoll"
import { YamsTurn } from "./YamsTurn"

describe("Domain unit tests (YamsTurn entity)", () => {
  describe("1) Valid YamsTurn ", () => {
    it("1.1) Default constructor ", () => {
      const turn = new YamsTurn()
      expect(turn.getRollNumber()).toBe(1)
      expect(turn.getDiceRoll()).toBeTruthy()
    })
    it("1.2) Constructor with parameters ", () => {
      const turn1 = new YamsTurn(2)
      expect(turn1.getRollNumber()).toBe(2)
      const existingDiceRoll = new DiceRoll()
      const turn2 = new YamsTurn(2, existingDiceRoll)      
      expect(turn2.getRollNumber()).toBe(2)
      expect(turn2.getDiceRoll()).toBe(existingDiceRoll)
    })
  })
  describe("2) canRoll()", () => {  
    it("2.1) returns true for roll 1", () => {
      const turn1 = new YamsTurn(1)
      expect(turn1.canRoll()).toBe(true)
    })
    
    it("2.2) returns true for roll 2", () => {
      const turn2 = new YamsTurn(2)
      expect(turn2.canRoll()).toBe(true)
    })
    
    it("2.3) returns false for roll 3", () => {
      const turn3 = new YamsTurn(3)
      expect(turn3.canRoll()).toBe(false)
    })
  })
  describe("3) nextRoll() ", () => {
    it("3.1) nextRoll no index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getRollNumber()).toBe(1)

      const turnB = turnA.nextRoll()
      expect (turnB.getRollNumber()).toBe(2)
      expect (turnA.getDiceRoll()).not.toBe(turnB.getDiceRoll())

      const turnC = turnB.nextRoll()
      expect (turnC.getRollNumber()).toBe(3)
      
      expect (() => turnC.nextRoll()).toThrow(MaxTurnsReachedError)
    })
    
    it("3.2) nextRoll one index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getRollNumber()).toBe(1)

      const turnB = turnA.nextRoll([0])
      expect (turnB.getRollNumber()).toBe(2)      
      
      expect (turnB.getDiceRoll().getDice()[0]).not.toBe(turnA.getDiceRoll().getDice()[0])
      
      for (let index = 1; index <= 4; index++) {
        const diceB = turnB.getDiceRoll().getDice()[index]
        const diceA = turnA.getDiceRoll().getDice()[index]
        expect(diceB).toBe(diceA)
      }
    })

    it("3.3) nextRoll several index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getRollNumber()).toBe(1)

      const turnB = turnA.nextRoll([0, 1 ,2])
      expect (turnB.getRollNumber()).toBe(2)      
            
      for (let index = 0; index <= 2; index++) {
        const diceB = turnB.getDiceRoll().getDice()[index]
        const diceA = turnA.getDiceRoll().getDice()[index]
        expect(diceB).not.toBe(diceA)
      }
      for (let index = 3; index <= 4; index++) {
        const diceB = turnB.getDiceRoll().getDice()[index]
        const diceA = turnA.getDiceRoll().getDice()[index]
        expect(diceB).toBe(diceA)
      }
    })
    it("3.4) nextRoll returns new instance", () => {
      const turnA = new YamsTurn()
      const turnB = turnA.nextRoll([0])
      
      expect(turnA).not.toBe(turnB)
      expect(turnA.getRollNumber()).toBe(1) 
      expect(turnB.getRollNumber()).toBe(2)
    })
    it("3.5) nextRoll with empty array rerolls all", () => {
      const turnA = new YamsTurn()
      const turnB = turnA.nextRoll([])
      
      expect(turnB.getRollNumber()).toBe(2)      
      expect(turnB.getDiceRoll().getDice()).toHaveLength(5)
    })
    

  })
  

})
