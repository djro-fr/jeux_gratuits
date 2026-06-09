import { InvalidDieValueError } from "../errors/YamsErrors"
import { Die } from "./Die"

describe("Domain unit tests (Die entity)", () => {
  describe("1) Valid dice creation", () => {
    it.each([1, 2, 3, 4, 5, 6])("1.%i) should create valid die %i", (value) => {
      const dice = new Die(value)
      expect(dice.getValue()).toBe(value)
      expect(dice.isKeptDie()).toBe(false)
    })
  })

  describe("2) Invalid values", () => {
    it("2.1) Throw error for invalid value (< 1)", () => {
      expect(() => new Die(0)).toThrow(InvalidDieValueError)
    })
    it("2.2) Throw error for invalid value (>6)", () => {
      expect(() => new Die(7)).toThrow(InvalidDieValueError)
    })
  })

  describe("3) toggleKeep()", () => {
    it("3.1) toggleKeep() false → true", () => {
      const dice = new Die(4, false)
      expect(dice.isKeptDie()).toBe(false)

      const toggledDie = dice.toggleKeep()
      expect(toggledDie.isKeptDie()).toBe(true)
      expect(dice.isKeptDie()).toBe(false)
    })

    it("3.2) toggleKeep() true → false", () => {
      const dice = new Die(4, true)
      expect(dice.isKeptDie()).toBe(true)

      const toggledDie = dice.toggleKeep()
      expect(toggledDie.isKeptDie()).toBe(false)
      expect(dice.isKeptDie()).toBe(true)
    })
  })

  describe("4) generateRandom()", () => {
    it("4.1) generateRandom() returns 1-6 ", () => {
      const dice = Die.generateRandom()
      expect(dice.getValue()).toBeGreaterThanOrEqual(1)
      expect(dice.getValue()).toBeLessThanOrEqual(6)
    })

    it("4.2) generateRandom() creates new instance each time", () => {
      const dice1 = Die.generateRandom()
      const dice2 = Die.generateRandom()
      expect(dice1).not.toBe(dice2)
    })
  })
})
