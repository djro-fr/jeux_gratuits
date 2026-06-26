import { useState } from "react"
import { useTranslation } from "react-i18next"
import { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import { YamsTurn } from "../../domain/entities/YamsTurn"
import { RollDiceUseCase } from "../../application/usecases/RollDiceUseCase"
import { KeepDiceUseCase } from "../../application/usecases/KeepDiceUseCase"
import { ScoreTurnUseCase } from "../../application/usecases/ScoreTurnUseCase"
import { YamsCategory } from "../../domain/rules/calculateScore"
import type { DiceRoll } from "../../domain/entities/DiceRoll"

interface UseYamsGameReturn {
  scoreBoard: YamsScoreBoard
  diceRoll: DiceRoll | null
  yamsTurn: YamsTurn | null
  selectedIndices: number[]
  selectedCategory: YamsCategory | null
  error: string | null
  showScoreBoard: boolean
  setSelectedIndices: (indices: number[]) => void
  setSelectedCategory: (category: YamsCategory | null) => void
  setShowScoreBoard: (show: boolean) => void
  setError: (error: string | null) => void
  handleRoll: () => void
  handleKeepDice: (indicesToKeep: number[]) => void
  handleScore: (category: YamsCategory) => void
  handleRestart: () => void
  handleFillTestData: () => void
}

export const useYamsGame = (): UseYamsGameReturn => {
  const { t } = useTranslation("yams")

  const [scoreBoard, setScoreBoard] = useState(() => YamsScoreBoard.create())
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null)
  const [yamsTurn, setYamsTurn] = useState<YamsTurn | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScoreBoard, setShowScoreBoard] = useState(false)

  const createTestScoreBoard = (): YamsScoreBoard => {
    let board = YamsScoreBoard.create()
    const testScores: Record<YamsCategory, number> = {
      ones: 5, twos: 10, threes: 15, fours: 20,
      fives: 25, sixes: 30, chance: 25, threeOfAKind: 20,
      fourOfAKind: 25, fullHouse: 25, smallStraight: 30,
      largeStraight: 40, yahtzee: 50
    }
    Object.entries(testScores).forEach(([category, score]) => {
      board = board.addScore(category as YamsCategory, score)
    })
    board = board.addYahtzeeBonus(100)
    board = board.addYahtzeeBonus(100)
    return board
  }

  const handleFillTestData = () => {
    setScoreBoard(createTestScoreBoard())
    setYamsTurn(null)
    setDiceRoll(null)
    setError(null)
  }

  const handleRoll = () => {
    try {
      if (yamsTurn !== null) return
      const diceResult = new RollDiceUseCase().execute(5)
      const turn = new YamsTurn(1, diceResult)
      setYamsTurn(turn)
      setDiceRoll(diceResult)
      setSelectedIndices([])
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      setError(t(`errors.${errorKey}`))
    }
  }

  const handleKeepDice = (indicesToKeep: number[]) => {
    try {
      if (!yamsTurn) return
      const newTurn = new KeepDiceUseCase().execute(yamsTurn, indicesToKeep)
      setYamsTurn(newTurn)
      setDiceRoll(newTurn.getDiceRoll())
      if (newTurn.getRollNumber() === 3) setSelectedIndices([])
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      setError(t(`errors.${errorKey}`))
    }
  }

  const handleScore = (category: YamsCategory) => {
    try {
      if (!diceRoll) return
      const result = new ScoreTurnUseCase().execute({
        yamsScoreBoard: scoreBoard,
        dice: diceRoll.getDice(),
        category
      })
      const allScored = Object.values(result.updatedScoreBoard.getAllScores())
        .every((score: number | null) => score !== null)

      setScoreBoard(result.updatedScoreBoard)
      setDiceRoll(null)
      setYamsTurn(null)
      setSelectedCategory(null)
      setSelectedIndices([])
      setShowScoreBoard(false)
      setError(null)

      if (!allScored) setYamsTurn(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      if (errorKey === 'categoryAlreadyScoredError') {
        setError(t(`errors.${errorKey}`, { category }))
      } else {
        setError(t(`errors.${errorKey}`))
      }
    }
  }

  const handleRestart = () => {
    setScoreBoard(YamsScoreBoard.create())
    setDiceRoll(null)
    setYamsTurn(null)
    setSelectedIndices([])
    setSelectedCategory(null)
    setError(null)
    setShowScoreBoard(false)
  }

  return {
    scoreBoard, diceRoll, yamsTurn,
    selectedIndices, selectedCategory,
    error, showScoreBoard,
    setSelectedIndices, setSelectedCategory,
    setShowScoreBoard, setError,
    handleRoll, handleKeepDice,
    handleScore, handleRestart, handleFillTestData
  }
}