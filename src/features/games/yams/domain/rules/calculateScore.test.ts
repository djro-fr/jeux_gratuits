import { Die } from "../valueObjects/Die"
import {
  calculateScoreByCategory,
  calculateTotalScore,
  calculateYahtzeeBonus,
  getDiceOccurrences,
  hasExactOccurrences,
  hasOccurrences,
  sumDiceByValue,
  YamsCategory,
} from "./calculateScore"

describe("1) sumDiceByValue", () => {
  it("should correctly adds the dice for a given value", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(sumDiceByValue(dice, 2)).toBe(6)
    expect(sumDiceByValue(dice, 4)).toBe(4)
    expect(sumDiceByValue(dice, 5)).toBe(5)
    expect(sumDiceByValue(dice, 6)).toBe(0)
  })
})

describe("2) getDiceOccurrences", () => {
  it("should correctly counts occurences", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(getDiceOccurrences(dice)).toStrictEqual([
      { value: 2, occurences: 3 },
      { value: 4, occurences: 1 },
      { value: 5, occurences: 1 },
    ])
  })
})

describe("3) hasOccurrences", () => {
  it("3.1) should return true if occurence count is at least the given number", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(hasOccurrences(2, dice)).toBe(true)
    expect(hasOccurrences(3, dice)).toBe(true)
  })
  it("3.2) should return false if occurence count is less than the given number", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(hasOccurrences(4, dice)).toBe(false)
  })
})

describe("4) hasExactOccurrences", () => {
  it("4.1) should return true if occurence count is the given number", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(hasExactOccurrences(3, dice)).toBe(true)
  })

  it("4.2) should return false if occurence count is less or more than the given number", () => {
    const dice = [new Die(2), new Die(2), new Die(2), new Die(4), new Die(5)]
    expect(hasExactOccurrences(2, dice)).toBe(false)
    expect(hasExactOccurrences(4, dice)).toBe(false)
  })
})

describe("5) isSequential(values: number[], minLength: number)", () => {
  describe("5.1) SmallStraight", () => {
    it("should return true when 4 or 5 sequential dice", () => {
      const smallStraight = [new Die(6), new Die(5), new Die(3), new Die(1), new Die(4)]
      const largeStraight = [new Die(5), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.SmallStraight, smallStraight)).toBe(30)
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, largeStraight)).toBe(40)
    })
  })

  describe("5.2) LargeStraight", () => {
    it("should return true when 5 sequential dice", () => {
      const largeStraight = [new Die(5), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, largeStraight)).toBe(40)
    })

    it("should return false when 4 sequential dice", () => {
      const smallStraight = [new Die(6), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, smallStraight)).toBe(null)
    })
  })
})

describe("6) calculateScoreByCategory", () => {
  describe("6.1) Sixes and other from upper section", () => {
    it("should sum dice values for simple categories (Ones to Sixes)", () => {
      const dice = [new Die(2), new Die(2), new Die(2), new Die(6), new Die(6)]
      const yahtzee = [new Die(6), new Die(6), new Die(6), new Die(6), new Die(6)]
      expect(calculateScoreByCategory(YamsCategory.Sixes, dice)).toBe(12)      
      expect(calculateScoreByCategory(YamsCategory.Sixes, yahtzee)).toBe(30)
    })
  })
  describe("6.2) Chance", () => {
    it("should sum dice values", () => {
      const dice = [new Die(2), new Die(2), new Die(2), new Die(6), new Die(6)]
      const yahtzee = [new Die(2), new Die(2), new Die(2), new Die(2), new Die(2)]
      expect(calculateScoreByCategory(YamsCategory.Chance, dice)).toBe(18)      
      expect(calculateScoreByCategory(YamsCategory.Chance, yahtzee)).toBe(10)
    })
  })
  describe("6.3) ThreeOfAKind", () => {
    it("should return sum when 3+ identical dice", () => {
      const threeOfAKind = [new Die(2), new Die(2), new Die(2), new Die(6), new Die(6)]
      const fourOfAKind = [new Die(2), new Die(2), new Die(2), new Die(2), new Die(6)]
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.ThreeOfAKind, threeOfAKind)).toBe(
        18,
      )
      expect(calculateScoreByCategory(YamsCategory.ThreeOfAKind, fourOfAKind)).toBe(
        14,
      )
      expect(calculateScoreByCategory(YamsCategory.ThreeOfAKind, yahtzee)).toBe(
        10,
      )
    })
  })

  describe("6.4) FourOfAKind", () => {
    it("should return sum when 4+ identical dice", () => {
      const fourOfAKind = [new Die(2), new Die(2), new Die(2), new Die(2), new Die(6)]
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.FourOfAKind, fourOfAKind)).toBe(14)
      expect(calculateScoreByCategory(YamsCategory.FourOfAKind, yahtzee)).toBe(
        10,
      )
    })
  })

  describe("6.5) Full House", () => {
    it("should return 25 when 3 identical dice + 2 identical dice", () => {
      const FH = [new Die(2), new Die(2), new Die(2), new Die(6), new Die(6)]
      expect(calculateScoreByCategory(YamsCategory.FullHouse, FH)).toBe(25)
    })
    it("should return null when 5 identical dice without yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.FullHouse, yahtzee)).toBe(null)
    })
    
    it("should return 25 as Joker when Yahtzee and yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.FullHouse, yahtzee, true)).toBe(25)
    })


    it("should return null when not a full house", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(6),
      ]
      expect(calculateScoreByCategory(YamsCategory.FullHouse, yahtzee)).toBe(null)
    })
  })

  describe("6.6) SmallStraight", () => {
    it("should return 30 when 4 or 5 sequential dice", () => {
      const smallStraight = [new Die(6), new Die(2), new Die(3), new Die(4), new Die(1)]
      const largeStraight = [new Die(5), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.SmallStraight, smallStraight)).toBe(30)
      expect(calculateScoreByCategory(YamsCategory.SmallStraight, largeStraight)).toBe(30)
    })    
    it("should return 30 as Joker when Yahtzee and yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.SmallStraight, yahtzee, true)).toBe(30)
    })
    
    it("should return null when Yahtzee without yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.SmallStraight, yahtzee)).toBe(null)
    })
  })

  describe("6.7) LargeStraight", () => {
    it("should return 40 when 5 sequential dice", () => {
      const largeStraight = [new Die(5), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, largeStraight)).toBe(40)
    })

    it("should return 40 as Joker when Yahtzee and yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, yahtzee, true)).toBe(40)
    })

    it("should return null when 4 sequential dice", () => {
      const smallStraight = [new Die(6), new Die(2), new Die(3), new Die(4), new Die(1)]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, smallStraight)).toBe(null)
    })
    
    it("should return null when Yahtzee without yahtzeeBoxFilled", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.LargeStraight, yahtzee)).toBe(null)
    })

  })

  describe("6.8) Yahtzee", () => {
    it("should return 50 when 5 identical dice", () => {
      const yahtzee = [
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
        new Die(2),
      ]
      expect(calculateScoreByCategory(YamsCategory.Yahtzee, yahtzee)).toBe(50)
    })
    it("should return null when no Yahtzee", () => {
      const FH = [new Die(2), new Die(2), new Die(2), new Die(6), new Die(6)]
      expect(calculateScoreByCategory(YamsCategory.Yahtzee, FH)).toBe(null)
    })
  })

})

describe("8) calculateYahtzeeBonus", () => {
  it("should add 100 when yahtzee filled with 50", () => {
    const yahtzee = [
      new Die(2),
      new Die(2),
      new Die(2),
      new Die(2),
      new Die(2),
    ]
    expect(calculateYahtzeeBonus(yahtzee,50)).toBe(100)
  })
  it("should add nothing when yahtzee filled with null", () => {
    const yahtzee = [
      new Die(2),
      new Die(2),
      new Die(2),
      new Die(2),
      new Die(2),
    ]
    expect(calculateYahtzeeBonus(yahtzee,0)).toBe(0)
  })
  it("should add nothing when no yahtzee", () => {
    const yahtzee = [
      new Die(2),
      new Die(2),
      new Die(2),
      new Die(5),
      new Die(2),
    ]
    expect(calculateYahtzeeBonus(yahtzee,50)).toBe(0)
  })
})

describe("9) calculateTotalScore", () => {
  it("should correctly add the 13 scores without bonus", () => {
    const scores = {
      ones: 3,
      twos: 6,
      threes: 9,
      fours: 12,
      fives: 15,
      sixes: 18,
      chance: 15,
      threeOfAKind: 15,
      fourOfAKind: 15,
      fullHouse: 25,
      smallStraight: 30,
      largeStraight: 40,
      yahtzee: 50,
    }
    expect(calculateTotalScore(scores)).toBe(253)
  })
  
  it("should correctly add the 13 scores with bonus", () => {
    const scores = {
      ones: 3,
      twos: 6,
      threes: 9,
      fours: 12,
      fives: 15,
      sixes: 18,
      chance: 15,
      threeOfAKind: 15,
      fourOfAKind: 15,
      fullHouse: 25,
      smallStraight: 30,
      largeStraight: 40,
      yahtzee: 50,
    }
    expect(calculateTotalScore(scores, 100)).toBe(353)
  })
})
