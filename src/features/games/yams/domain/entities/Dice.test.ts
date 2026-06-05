import { InvalidDiceValueError } from "../errors/YamsErrors";
import { Dice } from "./Dice";

describe("Domain unit tests (Dice entity)", () => {
  describe("1) Valid dice creation", () => {
    it.each([1, 2, 3, 4, 5, 6])("1.%i) should create valid die %i", (value) => {
      const dice = new Dice(value);
      expect(dice.getValue()).toBe(value);
      expect(dice.isKeptDice()).toBe(false);
    });
  });

  describe("2) Invalid values", () => {
    it("2.1) Throw error for invalid value (< 1)", () => {
      expect(() => new Dice(0)).toThrow(InvalidDiceValueError);
    });
    it("2.2) Throw error for invalid value (>6)", () => {
      expect(() => new Dice(7)).toThrow(InvalidDiceValueError);
    });
  });

  describe("3) toggleKeep()", () => {
    it("3.1) toggleKeep() false → true", () => {
      const dice = new Dice(4, false);
      expect(dice.isKeptDice()).toBe(false);

      const toggledDice = dice.toggleKeep();
      expect(toggledDice.isKeptDice()).toBe(true);
      expect(dice.isKeptDice()).toBe(false);
    });

    it("3.2) toggleKeep() true → false", () => {
      const dice = new Dice(4, true);
      expect(dice.isKeptDice()).toBe(true);

      const toggledDice = dice.toggleKeep();
      expect(toggledDice.isKeptDice()).toBe(false);
      expect(dice.isKeptDice()).toBe(true);
    });
  });

  describe("4) generateRandom()", () => {
    it("4.1) generateRandom() returns 1-6 ", () => {
      const dice = Dice.generateRandom();
      expect(dice.getValue()).toBeGreaterThanOrEqual(1);
      expect(dice.getValue()).toBeLessThanOrEqual(6);
    });

    it("4.2) generateRandom() creates new instance each time", () => {
      const dice1 = Dice.generateRandom();
      const dice2 = Dice.generateRandom();
      expect(dice1).not.toBe(dice2);
    });
  });
});
