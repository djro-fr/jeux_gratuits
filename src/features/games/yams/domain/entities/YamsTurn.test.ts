import { MaxTurnsReachedError } from "../errors/YamsErrors"
import { DiceRoll } from "./DiceRoll"
import { YamsTurn } from "./YamsTurn"

describe("Domain unit tests (YamsTurn entity)", () => {
  describe("1) Valid YamsTurn ", () => {
    it("1.1) Default constructor ", () => {
      const turn = new YamsTurn()
      expect(turn.getTurnNumber()).toBe(1)
      expect(turn.getDiceRoll()).toBeTruthy()
    })
    it("1.2) Constructor with parameters ", () => {
      const turn1 = new YamsTurn(2)
      expect(turn1.getTurnNumber()).toBe(2)
      const existingDiceRoll = new DiceRoll()
      const turn2 = new YamsTurn(2, existingDiceRoll)      
      expect(turn2.getTurnNumber()).toBe(2)
      expect(turn2.getDiceRoll()).toBe(existingDiceRoll)
    })
  })

  it("2) canRoll() ", () => {   
    const turn1 = new YamsTurn(1)
    expect (turn1.canRoll()).toBe(true)
    const turn2 = new YamsTurn(2)
    expect (turn2.canRoll()).toBe(true)
    const turn3 = new YamsTurn(3)
    expect (turn3.canRoll()).toBe(false)
  })

  describe("3) nextRoll() ", () => {
    it("3.1) nextRoll no index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getTurnNumber()).toBe(1)

      const turnB = turnA.nextRoll()
      expect (turnB.getTurnNumber()).toBe(2)
      expect (turnA.getDiceRoll()).not.toBe(turnB.getDiceRoll())

      const turnC = turnB.nextRoll()
      expect (turnC.getTurnNumber()).toBe(3)
      
      expect (() => turnC.nextRoll()).toThrow(MaxTurnsReachedError)
    })
    
    it("3.2) nextRoll one index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getTurnNumber()).toBe(1)

      const turnB = turnA.nextRoll([0])
      expect (turnB.getTurnNumber()).toBe(1)      
      
      expect (turnB.getDiceRoll().getDices()[0]).not.toBe(turnA.getDiceRoll().getDices()[0])
      
      for (let index = 1; index <= 4; index++) {
        const diceB = turnB.getDiceRoll().getDices()[index]
        const diceA = turnA.getDiceRoll().getDices()[index]
        expect(diceB).toBe(diceA)
      }
    })

    it("3.3) nextRoll several index parameter ", () => {      
      const turnA = new YamsTurn()
      expect (turnA.getTurnNumber()).toBe(1)

      const turnB = turnA.nextRoll([0, 1 ,2])
      expect (turnB.getTurnNumber()).toBe(1)      
            
      for (let index = 0; index <= 2; index++) {
        const diceB = turnB.getDiceRoll().getDices()[index]
        const diceA = turnA.getDiceRoll().getDices()[index]
        expect(diceB).not.toBe(diceA)
      }
      for (let index = 3; index <= 4; index++) {
        const diceB = turnB.getDiceRoll().getDices()[index]
        const diceA = turnA.getDiceRoll().getDices()[index]
        expect(diceB).toBe(diceA)
      }
    })
    

  })
  

})
