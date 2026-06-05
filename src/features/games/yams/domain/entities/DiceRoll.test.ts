import { DiceRoll } from "./DiceRoll"

describe("Domain unit tests (DiceRoll entity)", () => {

  describe("1) Valid DiceRoll ", () => {
    it("1.1) Length = 5 ", () => {
      const diceRoll = new DiceRoll()
      expect(diceRoll.getDices()).toHaveLength(5)
    })
    it.each([1, 2, 3, 4, 5])("1.2) Dice %i have a 1-6 value ", (value) => {
      const diceRoll = new DiceRoll()
      const dices = diceRoll.getDices();
      const dice = dices[value-1]
      expect(dice.getValue()).toBeGreaterThanOrEqual(1);
      expect(dice.getValue()).toBeLessThanOrEqual(6);
    })
    it("1.3) with dice parameter ", () => {
      const diceRoll1 = new DiceRoll()
      const dices1 = diceRoll1.getDices();
      const diceRoll2 = new DiceRoll(dices1)   
      expect(diceRoll2).not.toBe(diceRoll1)
      expect(diceRoll2.getDices()).not.toBe(dices1)
      expect(diceRoll2.getDices()).toHaveLength(5)
    })
  })

  describe("2) toggleKeep() ", () => {
    it.each([1, 2, 3, 4, 5])("2.1) Dice %i has isKept toggled", (value) => {
      const diceRoll1 = new DiceRoll()
      const dice1 = diceRoll1.getDices()[value-1]
      const isKept1 = dice1.isKeptDice()

      const diceRoll2 = diceRoll1.toggleKeep(value-1)      
      const dice2 = diceRoll2.getDices()[value-1]
      const isKept2 = dice2.isKeptDice()

      expect(isKept1).not.toBe(isKept2)
    })
    it.each([1, 2, 3, 4, 5])("2.2) Dice %i returns new DiceRoll", (value) => {
      const diceRoll1 = new DiceRoll()      
      const diceRoll2 = diceRoll1.toggleKeep(value-1)      
      expect(diceRoll1).not.toBe(diceRoll2)
    })
  })

  
  describe("3) reroll() ", () => {
    it("3.1) reroll 1 index", () => {
      const diceRoll1 = new DiceRoll()
      const diceRoll2 = diceRoll1.reroll([0])      
      expect(diceRoll1).not.toBe(diceRoll2)
    })        
    it("3.2) reroll several indices", () => {
      const diceRoll1 = new DiceRoll()
      const diceRoll2 = diceRoll1.reroll([0,2,4])      
      expect(diceRoll1).not.toBe(diceRoll2)
    })         
    it("3.3) no reroll for dice kept", () => {
      const diceRoll1 = new DiceRoll()
      const diceRoll1Kept = diceRoll1.toggleKeep(0)
      const dice0Before = diceRoll1Kept.getDices()[0].getValue()

      const diceRoll2 = diceRoll1Kept.reroll([0])         
      const dice0After = diceRoll2.getDices()[0].getValue()
      expect(dice0Before).toBe(dice0After)      
    })   
  })


})