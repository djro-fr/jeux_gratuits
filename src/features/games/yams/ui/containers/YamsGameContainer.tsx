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

export const YamsGameContainer = () => {

  const [scoreBoard, setScoreBoard] = useState(() => YamsScoreBoard.create())
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null)
  const [yamsTurn, setYamsTurn] = useState<YamsTurn | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)

  const handleRoll = () => {
    if (yamsTurn === null) {  
      const rollUseCase = new RollDiceUseCase()
      const diceResult = rollUseCase.execute(5)
      const turn = new YamsTurn(1, diceResult)
      setYamsTurn(turn)
      setDiceRoll(diceResult)
      setSelectedIndices([])
    } 
  }

  const handleKeepDice = (indicesToKeep: number[]) => {
    if (!yamsTurn) return
    const keepUseCase = new KeepDiceUseCase()
    const newTurn = keepUseCase.execute(yamsTurn, indicesToKeep)
    setYamsTurn(newTurn)
    setDiceRoll(newTurn.getDiceRoll())
    setSelectedIndices([])
  }

  const handleScore = (category: YamsCategory) => {
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
  }
  
  const { t } = useTranslation('yams')
  return (
    <div className="yams">
    {yamsTurn === null ? (
      <button onClick={handleRoll}>
        {t("ui.rollDice")}
      </button>
    ) : (
      <>
        <DiceDisplay
          dice={diceRoll?.getDice()} 
          selectedIndices={selectedIndices} 
          onSelectDice={setSelectedIndices}
          rollNumber={yamsTurn.getRollNumber()} 
        />
        <button onClick={() => handleKeepDice(selectedIndices)}>
          {t('ui.reroll')}
        </button>
        
        <ScoreBoard 
          scoreBoard={scoreBoard}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <button onClick={() => selectedCategory && handleScore(selectedCategory)}>
          {t('ui.score')}
        </button>
      </>
    )}
  </div>
  )
}