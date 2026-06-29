import { Die } from "../valueObjects/Die"

export const YamsCategory = {
  Ones: "ones",
  Twos: "twos",
  Threes: "threes",
  Fours: "fours",
  Fives: "fives",
  Sixes: "sixes",
  Chance: "chance",
  ThreeOfAKind: "threeOfAKind",
  FourOfAKind: "fourOfAKind",
  FullHouse: "fullHouse",
  SmallStraight: "smallStraight",
  LargeStraight: "largeStraight",
  Yahtzee: "yahtzee",
} as const

export type YamsCategory = (typeof YamsCategory)[keyof typeof YamsCategory]

export type DiceOccurence = {
  value: number
  occurences: number
}

export function sumDiceByValue(dice: Die[], value: number): number {
  return dice
    .filter((die) => die.getValue() === value)
    .reduce((sum, die) => sum + die.getValue(), 0)
}

export function getDiceOccurrences(dice: Die[]): DiceOccurence[] {
  const aOccurences: DiceOccurence[] = []
  const uniqueValues = [...new Set(dice.map((die) => die.getValue()))]
  uniqueValues.forEach((value) => {
    const count = dice.filter((die) => die.getValue() === value).length
    aOccurences.push({ value: value, occurences: count })
  })
  return aOccurences
}

export function hasOccurrences(occurence: number, dice: Die[]): boolean {
  const diceOccurences = getDiceOccurrences(dice)
  return diceOccurences.some((d) => d.occurences >= occurence)
}

export function hasExactOccurrences(occurence: number, dice: Die[]): boolean {
  const diceOccurences = getDiceOccurrences(dice)
  return diceOccurences.some((d) => d.occurences === occurence)
}

function isSequential(values: number[], minLength: number): boolean {
  const unique = Array.from(new Set(values)).toSorted((a, b) => a - b)    
  let consecutiveCount  = 1
  for (let i = 0; i < unique.length ; i++) {
    if (unique[i + 1] - unique[i] === 1) {
      consecutiveCount++
      if (consecutiveCount >= minLength) return true
    }else {
      consecutiveCount = 1 
    }
  }
  return false
}

type ScoreCalculator = (dice: Die[]) => number | null

const scoreStrategies: Record<YamsCategory, ScoreCalculator> = {
  [YamsCategory.Ones]: (dice) => sumDiceByValue(dice, 1),
  [YamsCategory.Twos]: (dice) => sumDiceByValue(dice, 2),
  [YamsCategory.Threes]: (dice) => sumDiceByValue(dice, 3),
  [YamsCategory.Fours]: (dice) => sumDiceByValue(dice, 4),
  [YamsCategory.Fives]: (dice) => sumDiceByValue(dice, 5),
  [YamsCategory.Sixes]: (dice) => sumDiceByValue(dice, 6),
  [YamsCategory.Chance]: (dice) => dice.reduce((sum, die) => sum + die.getValue(), 0),
  [YamsCategory.ThreeOfAKind]: (dice) => 
    hasOccurrences(3, dice) ? dice.reduce((sum, die) => sum + die.getValue(), 0) : null,
  [YamsCategory.FourOfAKind]: (dice) => 
    hasOccurrences(4, dice) ? dice.reduce((sum, die) => sum + die.getValue(), 0) : null,
  [YamsCategory.FullHouse]: (dice) => 
    (hasExactOccurrences(3, dice) && hasExactOccurrences(2, dice) && !hasOccurrences(5, dice)) ? 25 : null,
  [YamsCategory.SmallStraight]: (dice) => 
    isSequential(dice.map(die => die.getValue()), 4) ? 30 : null,
  [YamsCategory.LargeStraight]: (dice) => 
    isSequential(dice.map(die => die.getValue()), 5) ? 40 : null,
  [YamsCategory.Yahtzee]: (dice) => 
    hasOccurrences(5, dice) ? 50 : null,
}

export function calculateScoreByCategory(
  category: YamsCategory, 
  dice: Die[], 
  yahtzeeBoxFilled?: boolean
): number | null {
  // Joker Rule
  if (hasOccurrences(5, dice) && yahtzeeBoxFilled) {
    if (category === YamsCategory.FullHouse) return 25
    if (category === YamsCategory.SmallStraight) return 30
    if (category === YamsCategory.LargeStraight) return 40
  }

  return scoreStrategies[category](dice)
}

export function calculateYahtzeeBonus(
  dice: Die[], 
  yahtzeeBoxScore: number
): number {
  if (hasOccurrences(5, dice) && yahtzeeBoxScore === 50) {
    return 100
  }
  return 0
}

export function calculateTotalScore(scores : Record<YamsCategory, number | null>,
  totalYahtzeeBonus: number = 0) : number{  
  return Object.values(scores)
    .filter((score) => score !== null)
    .reduce((sum,score) => sum + score, 0) + totalYahtzeeBonus
}
