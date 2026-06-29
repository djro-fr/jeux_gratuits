import type { Die } from "../valueObjects/Die"
import { YamsCategory } from "./calculateScore"

export function explainScore(category: YamsCategory, dice: Die[]): string[] {
  const values = dice.map((d) => d.getValue())
  const sorted = [...values].sort((a, b) => a - b)

  switch (category) {
    case YamsCategory.Ones:
      return [
        `Somme, ${values.filter((v) => v === 1).length} dé(s) à 1`,
      ]

    case YamsCategory.Twos:
      return [
        `Somme, ${values.filter((v) => v === 2).length} dé(s) à 2`,
      ]

    case YamsCategory.Threes:
      return [
        `Somme, ${values.filter((v) => v === 3).length} dé(s) à 3`,
      ]

    case YamsCategory.Fours:
      return [
        `Somme, ${values.filter((v) => v === 4).length} dé(s) à 4`,
      ]

    case YamsCategory.Fives:
      return [
        `Somme, ${values.filter((v) => v === 5).length} dé(s) à 5`,
      ]

    case YamsCategory.Sixes:
      return [
        `Somme, ${values.filter((v) => v === 6).length} dé(s) à 6`,
      ]

    case YamsCategory.Chance:
      return [
        `Somme de tous les dés :`,
        `${values.join(" + ")}`,
      ]

    case YamsCategory.ThreeOfAKind:
      return [
        `Si 3 dés identiques ou plus,`, `somme de tous les dés :`,
        `${values.join(" + ")}`,
      ]

    case YamsCategory.FourOfAKind:
      return [
        `Si 4 dés identiques ou plus,`, `somme de tous les dés :`,
        `${values.join(" + ")}`,
      ]

    case YamsCategory.FullHouse:
      return [
        `3 dés identiques et`, `2 identiques d'une autre valeur`,
      ]

    case YamsCategory.SmallStraight:
      return [`4 dés consécutifs`]

    case YamsCategory.LargeStraight:
      return [`5 dés consécutifs`]

    case YamsCategory.Yahtzee:
      return [`5 dés identiques`]

    default:
      return [`Dés : ${sorted.join(", ")}`]
  }
}
