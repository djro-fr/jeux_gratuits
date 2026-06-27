import { useState } from "react"
import { useTranslation } from "react-i18next"
import { calculateTotalScore, YamsCategory } from "../../domain/rules/calculateScore"
import { DiceDisplay } from "../components/DiceDisplay"
import { ScoreBoard } from "../components/ScoreBoard"
import { ErrorModal } from "../components/ErrorModal"
import { Modal } from "@/shared/components/Modal"  
import { IconsSprite } from "@/shared/components/IconsSprite"
import { GlobalLeaderboard } from "../components/GlobalLeaderboard"
import { useYamsGame } from "../hooks/useYamsGame"
import { useSaveScore } from "../hooks/useSaveScore"

export const YamsGameContainer = () => {
  const { t } = useTranslation("yams")
  const { t: tGames } = useTranslation()

  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const {
    scoreBoard, diceRoll, yamsTurn,
    selectedIndices, selectedCategory,
    error, showScoreBoard,
    setSelectedIndices, setSelectedCategory,
    setShowScoreBoard, setError,
    handleRoll, handleKeepDice,
    handleScore, handleRestart, handleFillTestData
  } = useYamsGame()

  const categories = Object.values(YamsCategory)

  const { playerName, setPlayerName, handleSaveAndRestart } = useSaveScore({
    scoreBoard,
    onSuccess: handleRestart,
    setError,
    setSuccessMessage  
  })
  
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
  }

  if (yamsTurn === null && !Object.values(scoreBoard.getAllScores()).includes(null)) {
    const totalYahtzeeBonus = scoreBoard.getTotalYahtzeeBonus()
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + totalYahtzeeBonus

    const handleCloseSuccessModal = () => {
      setSuccessMessage(null)
      handleRestart()
    }

    return (
      <>
      <Modal
        isOpen={!!successMessage}
        onClose={handleCloseSuccessModal}
        title={t('')}
      >
        <div className="text-center">
          <p className="text-xl my-6">{successMessage}</p>
          <button
            onClick={handleCloseSuccessModal}
            className="action w-full max-w-30"
          >
            {t('ui.success')}
          </button>
        </div>
      </Modal>

        <div className="game-over">
          <p className="mt-4 text-xl font-semibold text-primary-light text-center">{t('ui.gameOver')}</p>
          <h2 className="mt-10">Total</h2>
          <p className="w-full text-center text-primary-light text-2xl">
            <span className="text-5xl">{totalScore}</span> points
          </p>
          {totalYahtzeeBonus > 0 && (
            <p className="w-full text-center text-white text-xl">
              ({calculateTotalScore(scoreBoard.getAllScores())} + {totalYahtzeeBonus} bonus {tGames('game.yams')})
            </p>
          )}
          <h2 className="mt-10">Détail</h2>
        </div>

        <div className="scoreboard game-over">
          <div className="scores">
            {categories.map((category) => (
              <button key={category} className="category">
                <span className="name">{t(`categories.${category}`)}</span>
                <span className="score">{scoreBoard.getScore(category)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-6 mt-0">
          <div className="flex flex-col">
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value)
                setError(null)
              }}
              id="player-name"
              placeholder={t('ui.enterName')}
              maxLength={10}
              className="text-white text-2xl mb-4 text-center"
            />
            {error && <div className="error-message">{error}</div>}
            <button className="action gold icon md w-full mx-auto" onClick={handleSaveAndRestart}>
              {t('ui.saveScore')}
            </button>
          </div>
          <button className="action second w-full mb-7 mx-auto" onClick={handleRestart}>
            {t('ui.restart')}
          </button>
        </div>

        <GlobalLeaderboard />
      </>
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

      <div className={yamsTurn.getRollNumber() < 3 ? "flex justify-center gap-x-4" : "flex w-[50%] mx-auto justify-center"}>
        {yamsTurn.getRollNumber() < 3 && (
          <button className="action flex-1 gold icon md w-full" onClick={() => handleKeepDice(selectedIndices)}>
            <div>
              <IconsSprite value="reroll" />
              {t('ui.reroll')}
            </div>
          </button>
        )}
        <button className="action gold icon md w-full" onClick={() => setShowScoreBoard(!showScoreBoard)}>
          <div>
            <IconsSprite value="score" />
            {t('ui.toScore')}
          </div>
        </button>
      </div>
      <div>
        <button className="action ml-2" onClick={handleFillTestData}>
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