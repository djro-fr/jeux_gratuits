import { useTranslation } from "react-i18next"
import { useState } from "react"
import { YamsScoreBoard } from "../../application/entities/YamsScoreBoard"
import type { DiceRoll } from "../../domain/entities/DiceRoll"
import { YamsTurn } from "../../domain/entities/YamsTurn"
import { RollDiceUseCase } from "../../application/usecases/RollDiceUseCase"
import { KeepDiceUseCase } from "../../application/usecases/KeepDiceUseCase"
import { ScoreTurnUseCase } from "../../application/usecases/ScoreTurnUseCase"
import type { YamsCategory } from "../../domain/rules/calculateScore"
import { DiceDisplay } from "../components/DiceDisplay"
import { ScoreBoard } from "../components/ScoreBoard"
import { ErrorModal } from "../components/ErrorModal"

export const YamsGameContainer = () => {
  const { t } = useTranslation("yams")

  const [scoreBoard, setScoreBoard] = useState(() => YamsScoreBoard.create())
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null)
  const [yamsTurn, setYamsTurn] = useState<YamsTurn | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScoreBoard, setShowScoreBoard] = useState(false)

  const createTestScoreBoard1 = (): YamsScoreBoard => {
    let board = YamsScoreBoard.create()
    const testScores = {
      ones: 5,
      twos: 10,
      threes: 15,
      fours: 20,
      fives: 25,
      sixes: 30,
      chance: 25,
      threeOfAKind: 20,
      fourOfAKind: 25,
      fullHouse: 25,
      smallStraight: 30,
      largeStraight: 40,
      yahtzee: 50
    }
    Object.entries(testScores).forEach(([category, score]) => {
      board = board.addScore(category as YamsCategory, score)
    })    
    return board
  }
  const handleFillTestData = () => {
    setScoreBoard(createTestScoreBoard1())
    setYamsTurn(null)
    setDiceRoll(null)
    setError(null)
  }

  const handleRoll = () => {
    try {
      if (yamsTurn === null) {
        const rollUseCase = new RollDiceUseCase()
        const diceResult = rollUseCase.execute(5)
        const turn = new YamsTurn(1, diceResult)
        setYamsTurn(turn)
        setDiceRoll(diceResult)
        setSelectedIndices([])
        setError(null)
      }
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      setError(t(`errors.${errorKey}`))
    }
  }

  const handleKeepDice = (indicesToKeep: number[]) => {
    try {
      if (!yamsTurn) return
      const keepUseCase = new KeepDiceUseCase()
      const newTurn = keepUseCase.execute(yamsTurn, indicesToKeep)
      setYamsTurn(newTurn)
      setDiceRoll(newTurn.getDiceRoll()) 
      if (newTurn.getRollNumber() === 3) {
        setSelectedIndices([])
      }
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      setError(t(`errors.${errorKey}`))
    }
  }

  const handleScore = (category: YamsCategory) => {
    try {
      if (!diceRoll) return
      const scoreUseCase = new ScoreTurnUseCase()
      const result = scoreUseCase.execute({
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
      
      if (!allScored) {
        setYamsTurn(null)  
      }
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      if (errorKey === 'categoryAlreadyScoredError') {
        setError(t(`errors.${errorKey}`, { category }))
      } else {
        setError(t(`errors.${errorKey}`))
      }
    }
  }

  if (yamsTurn === null && Object.values(scoreBoard.getAllScores()).includes(null)) {
    return (
      <>
        <ErrorModal error={error} onClose={() => setError(null)} />
        <button className="action" onClick={handleRoll}>
          {t("ui.rollDice")}
        </button>
      </>
    )
  }else if (yamsTurn === null && !Object.values(scoreBoard.getAllScores()).includes(null)) {
    return (
      <div className="game-over">
        <h2>{t('ui.gameOver')}</h2>
        <p></p>
      </div>
    )
  }
  
  if (!yamsTurn) {
    throw new Error('Unexpected state: yamsTurn should not be null')
  }

  return (
    <>
      <ErrorModal error={error} onClose={() => setError(null)} />
      
      <DiceDisplay
        dice={diceRoll?.getDice()}
        selectedIndices={selectedIndices}
        onSelectDice={setSelectedIndices}
        rollNumber={yamsTurn.getRollNumber()}
      />

      {yamsTurn.getRollNumber() < 3 && (
        <button className="action" onClick={() => handleKeepDice(selectedIndices)}>
          {t('ui.reroll')}
        </button>
      )}


      <button 
        className="action ml-2"
        onClick={handleFillTestData}
      >
        Fill Test Data (DEV)
      </button>
      
      <button 
        className="action ml-2" 
        onClick={() => setShowScoreBoard(!showScoreBoard)}
      >
        {t('ui.score')}
      </button>

      {showScoreBoard && (
        <ScoreBoard
          scoreBoard={scoreBoard}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onScore={handleScore}
          onClose={() => setShowScoreBoard(false)}
          dice={diceRoll?.getDice()}
        />
      )}
    </>
  )
}