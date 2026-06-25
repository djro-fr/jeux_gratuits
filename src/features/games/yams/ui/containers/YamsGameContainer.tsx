import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { GlobalLeaderboard } from "../components/GlobalLeaderboard"


export const YamsGameContainer = () => {
  const { t } = useTranslation("yams")
  const { t: tGames } = useTranslation()

  const [scoreBoard, setScoreBoard] = useState(() => YamsScoreBoard.create())
  const [diceRoll, setDiceRoll] = useState<DiceRoll | null>(null)
  const [yamsTurn, setYamsTurn] = useState<YamsTurn | null>(null)
  const [selectedIndices, setSelectedIndices] = useState<number[]>([])
  const [selectedCategory, setSelectedCategory] = useState<YamsCategory | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showScoreBoard, setShowScoreBoard] = useState(false)

  const categories = Object.values(YamsCategory)

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
    board = board.addYahtzeeBonus(100) 
    board = board.addYahtzeeBonus(100) 
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

  const handleRestart = () => {
    setScoreBoard(YamsScoreBoard.create())
    setDiceRoll(null)
    setYamsTurn(null)
    setSelectedIndices([])
    setSelectedCategory(null)
    setError(null)
    setShowScoreBoard(false)
  }
  
  const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + scoreBoard.getTotalYahtzeeBonus()
  
  const handleSaveAndRestart = async () => {
    const playerName = prompt(t('ui.enterName')) || 'Anonyme'
    if (playerName === null) return 
    
    const saveUseCase = new SaveGameScoreUseCase()
    const result = await saveUseCase.execute(playerName, totalScore, scoreBoard.getTotalYahtzeeBonus())
    
    if (result.success) {
      alert(t('ui.scoreSaved'))
      handleRestart()
    } else {
      alert(`Erreur: ${result.error}`)
    }
  }


  if (yamsTurn === null && Object.values(scoreBoard.getAllScores()).includes(null)) {
    return (
      <>
        <ErrorModal error={error} onClose={() => setError(null)} />
          <div className="flex flex-1 flex-col justify-center items-center pb-16">
            <button className="action gold icon md" onClick={handleRoll}>
              <div> 
                <IconsSprite value="roll" />
                {t("ui.rollDice")}
              </div>
            </button>
          </div>
      </>
    )
  }else if (yamsTurn === null && !Object.values(scoreBoard.getAllScores()).includes(null)) {
    const totalYahtzeeBonus = scoreBoard.getTotalYahtzeeBonus()
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + totalYahtzeeBonus
  
    return (<>
      <div className="game-over">
        <p className="mt-4 text-xl font-semibold text-primary-light text-center">{t('ui.gameOver')}</p>
        <h2 className="mt-10">Total</h2>
        <p className="w-full text-center text-primary-light text-2xl"> <span className="text-4xl">{totalScore}</span> points</p>
        {totalYahtzeeBonus > 0 && (
        <p className="w-full text-center text-white text-xl">
          ({calculateTotalScore(scoreBoard.getAllScores())} + {totalYahtzeeBonus} bonus {tGames('game.yams')})
        </p>
      )}
        <h2 className="mt-10">Détail</h2>
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
      <div className="flex flex-col gap-3 mb-6 mt-0">
        <button 
          className="action gold icon md w-full"
          onClick={handleSaveAndRestart}
        >
          <div>{t('ui.save')}</div>
        </button>
        
        <button 
          className="action second w-full"
          onClick={handleRestart}
        >
          {t('ui.restart')}
        </button>
      </div>        
      <GlobalLeaderboard />      

        
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
      <div className={yamsTurn.getRollNumber() < 3 ? ("grid grid-cols-2 gap-x-4") : "w-[40%] mx-auto "}>
        {yamsTurn.getRollNumber() < 3 && (
          <button className="action gold icon md w-full" onClick={() => handleKeepDice(selectedIndices)}>    
            <div>      
              <IconsSprite value="reroll" />
              {t('ui.reroll')}
            </div>
          </button>
        )}

    
        <button 
          className="action gold icon md w-full" 
          onClick={() => setShowScoreBoard(!showScoreBoard)}
        >                  
          <div>
            <IconsSprite value="score" />
            {t('ui.toScore')}
          </div>
        </button>

        
        <button 
          className="action ml-2"
          onClick={handleFillTestData}
        >
          Fill Test Data (DEV)
        </button> 
      </div>
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