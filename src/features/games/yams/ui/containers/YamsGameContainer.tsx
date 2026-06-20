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
      setScoreBoard(result.updatedScoreBoard)
      setDiceRoll(null)
      setYamsTurn(null)
      setSelectedCategory(null)
      setShowScoreBoard(false)
      setError(null)
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknown'
      if (errorKey === 'categoryAlreadyScoredError') {
        setError(t(`errors.${errorKey}`, { category }))
      } else {
        setError(t(`errors.${errorKey}`))
      }
    }
  }

  if (yamsTurn === null) {
    return (
      <>
        <ErrorModal error={error} onClose={() => setError(null)} />
        <button className="action" onClick={handleRoll}>
          {t("ui.rollDice")}
        </button>
      </>
    )
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