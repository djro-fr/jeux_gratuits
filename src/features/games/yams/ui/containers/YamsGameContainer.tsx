import { useTranslation } from "react-i18next"
import { useState } from "react"
import { YamsScoreBoard } from "../../application/entities/YamsScoreBoard"
import type { DiceRoll } from "../../domain/entities/DiceRoll"
import { YamsTurn } from "../../domain/entities/YamsTurn"
import { RollDiceUseCase } from "../../application/usecases/RollDiceUseCase"
import { KeepDiceUseCase } from "../../application/usecases/KeepDiceUseCase"
import { ScoreTurnUseCase } from "../../application/usecases/ScoreTurnUseCase"
import { calculateTotalScore, YamsCategory } from "../../domain/rules/calculateScore"
import { DiceDisplay } from "../components/DiceDisplay"
import { ScoreBoard } from "../components/ScoreBoard"
import { ErrorModal } from "../components/ErrorModal"
import { IconsSprite } from "@/shared/components/IconsSprite"

export const YamsGameContainer = () => {
  const { t } = useTranslation("yams")

  const [scoreBoard, setScoreBoard] = useState(() => YamsScoreBoard.create())
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null)
  const [yamsTurn, setYamsTurn] = useState<YamsTurn | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScoreBoard, setShowScoreBoard] = useState(false)

  const categories = Object.values(YamsCategory)

  // const createTestScoreBoard1 = (): YamsScoreBoard => {
  //   let board = YamsScoreBoard.create()
  //   const testScores = {
  //     ones: 5,
  //     twos: 10,
  //     threes: 15,
  //     fours: 20,
  //     fives: 25,
  //     sixes: 30,
  //     chance: 25,
  //     threeOfAKind: 20,
  //     fourOfAKind: 25,
  //     fullHouse: 25,
  //     smallStraight: 30,
  //     largeStraight: 40,
  //     yahtzee: 50
  //   }
  //   Object.entries(testScores).forEach(([category, score]) => {
  //     board = board.addScore(category as YamsCategory, score)
  //   })    
  //   board = board.addYahtzeeBonus(100) 
  //   board = board.addYahtzeeBonus(100) 
  //   return board
  // }
  // const handleFillTestData = () => {
  //   setScoreBoard(createTestScoreBoard1())
  //   setYamsTurn(null)
  //   setDiceRoll(null)
  //   setError(null)
  // }

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
        <button className="action icon" onClick={handleRoll}>
          <IconsSprite value="roll" />
          {t("ui.rollDice")}
        </button>
      </>
    )
  }else if (yamsTurn === null && !Object.values(scoreBoard.getAllScores()).includes(null)) {
    const totalYahtzeeBonus = scoreBoard.getTotalYahtzeeBonus()
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + totalYahtzeeBonus
  
    return (<>
      <div className="game-over">
        <p>{t('ui.gameOver')}</p>
        <h2>Total</h2>
        <p className="w-full text-center"> <span className="text-3xl">{totalScore}</span> points</p>
        {totalYahtzeeBonus > 0 && (
        <p className="w-full text-center">
          ({calculateTotalScore(scoreBoard.getAllScores())} + {totalYahtzeeBonus} bonus Yahtzee)
        </p>
      )}
        <h2>Détail</h2>
      </div>
      <div className="scoreboard game-over">
        <div className="scores">
          {
            categories.map((category) => {
              return (
                <button key={category} className="category">      
                  <span className="name">{t(`categories.${category}`)}</span>
                  <span className="score">{scoreBoard.getScore(category)}</span>
                </button>
              )
            })
          }        
        </div>
      </div>
      
    </>)
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
        <button className="action icon" onClick={() => handleKeepDice(selectedIndices)}>          
          <IconsSprite value="reroll" />
          {t('ui.reroll')}
        </button>
      )}

   
      <button 
        className="action icon ml-2" 
        onClick={() => setShowScoreBoard(!showScoreBoard)}
      >
                  
          <IconsSprite value="score" />
        {t('ui.score')}
      </button>

      
      {/* <button 
        className="action ml-2"
        onClick={handleFillTestData}
      >
        Fill Test Data (DEV)
      </button> */}

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