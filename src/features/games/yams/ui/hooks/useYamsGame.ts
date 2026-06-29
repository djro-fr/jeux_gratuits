import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { YamsScoreBoard } from "../../domain/valueObjects/YamsScoreBoard"
import { YamsTurn } from "../../domain/valueObjects/YamsTurn"

import { KeepDiceUseCase } from "../../application/usecases/KeepDiceUseCase"

import { YamsCategory } from "../../domain/rules/calculateScore"
import { DiceRoll } from "../../domain/valueObjects/DiceRoll"
import { YamsGame } from "../../domain/aggregates/YamsGame"
import { RecordScoreUseCase } from "../../application/usecases/RecordScoreUseCase"

interface UseYamsGameReturn {
  game: YamsGame
  scoreBoard: YamsScoreBoard
  diceRoll: DiceRoll
  yamsTurn: YamsTurn
  selectedIndices: number[]
  selectedCategory: YamsCategory | null
  error: string | null
  showScoreBoard: boolean
  setSelectedIndices: (indices: number[]) => void
  setSelectedCategory: (category: YamsCategory | null) => void
  setShowScoreBoard: (show: boolean) => void
  setError: (error: string | null) => void
  handleKeepDice: (indicesToKeep: number[]) => void
  handleScore: (category: YamsCategory) => void
  handleRestart: () => void
  handleFillTestData: () => void
}

export const useYamsGame = (): UseYamsGameReturn => {
  const { t } = useTranslation("yams")

  const [game, setGame] = useState<YamsGame>(() => new YamsGame())

  const scoreBoard = game.getScoreBoard()
  const yamsTurn = game.getCurrentTurn()
  const diceRoll = yamsTurn.getDiceRoll()

  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScoreBoard, setShowScoreBoard] = useState(false)
  
  const keepDiceUseCase = useMemo(() => new KeepDiceUseCase(), [])
  const scoreTurnUseCase = useMemo(() => new RecordScoreUseCase(), [])  

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
    try {
      const testBoard = createTestScoreBoard()
      const validatedTurns = Array.from({ length: 13 }, () => ({
        turn: new YamsTurn(),
        finalDice: new DiceRoll().getDice()
      }))
      const game = new YamsGame(
        testBoard,
        new YamsTurn(),
        13,
        validatedTurns
      )
      
      setGame(game)
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknownError'
      setError(t(`errors.${errorKey}`))
    }
  }
 
  const handleKeepDice = (indicesToKeep: number[]) => {
    try {
      const updated = keepDiceUseCase.execute({
        game,
        indicesToKeep
      })
      setGame(updated)
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknownError'
      setError(t(`errors.${errorKey}`))
    }
  }
  
  const handleScore = (category: YamsCategory) => {
    try {
      const updated = scoreTurnUseCase.execute({ game, category })  
      setGame(updated)
      setSelectedCategory(null)
      setSelectedIndices([])
      setShowScoreBoard(false)
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknownError'
      setError(t(`errors.${errorKey}`, { category }))
    }
  }

  const handleRestart = () => {
    setGame(new YamsGame())
    setSelectedIndices([])
    setSelectedCategory(null)
    setError(null)
    setShowScoreBoard(false)
  }

  return {
    game,
    scoreBoard, diceRoll, yamsTurn,
    selectedIndices, selectedCategory,
    error, showScoreBoard,
    setSelectedIndices, setSelectedCategory,
    setShowScoreBoard, setError,
    handleKeepDice,
    handleScore, handleRestart, handleFillTestData
  }
}