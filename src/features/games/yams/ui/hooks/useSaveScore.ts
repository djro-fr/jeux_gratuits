import { useState } from "react"
import { useTranslation } from "react-i18next"
import { calculateTotalScore } from "../../domain/rules/calculateScore"
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { FirebaseScoreRepository } from "../../infrastructure/firebase/repositories/FirebaseScoreRepository"
import type { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import type { SaveGameScoreInput } from "../../application/dtos/SaveGameScoreDTO"

interface UseSaveScoreProps {
  scoreBoard: YamsScoreBoard
  onSuccess: () => void
  setError: (error: string | null) => void
}

interface UseSaveScoreReturn {
  playerName: string
  setPlayerName: (name: string) => void
  handleSaveAndRestart: () => Promise<void>
}

export const useSaveScore = ({
  scoreBoard,
  onSuccess,
  setError,
}: UseSaveScoreProps): UseSaveScoreReturn => {
  const { t } = useTranslation("yams")
  const [playerName, setPlayerName] = useState('')

  const handleSaveAndRestart = async () => {
    setError(null)

    const trimmedName = playerName.trim()
    if (trimmedName.length === 0) {
      setError(t('errors.playerNameEmpty'))
      return
    }
    if (trimmedName.length > 10) {
      setError(t('errors.playerNameTooLong'))
      return
    }

    const saveUseCase = new SaveGameScoreUseCase(new FirebaseScoreRepository())
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + scoreBoard.getTotalYahtzeeBonus()

    const input: SaveGameScoreInput = {
      playerName,
      score: totalScore,
      yahtzeeBonus: scoreBoard.getTotalYahtzeeBonus()
    }

    const result = await saveUseCase.execute(input)

    if (result.success) {
      alert(t('ui.scoreSaved'))
      setPlayerName('')
      onSuccess()
    } else {
      setError(result.error || t('errors.unknownError'))
    }
  }

  return { playerName, setPlayerName, handleSaveAndRestart }
}