import { useState } from "react"
import { useTranslation } from "react-i18next"
import { calculateTotalScore } from "../../domain/rules/calculateScore"
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { FirebaseScoreRepository } from "../../infrastructure/firebase/repositories/FirebaseScoreRepository"
import type { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import type { SaveGameScoreInput } from "../../application/dtos/SaveGameScoreDTO"
import type { LeaderboardScore } from "../../domain/repositories/ILeaderboardRepository"

interface UseSaveScoreProps {
  scoreBoard: YamsScoreBoard
  leaderboardScores: LeaderboardScore[]
  setError: (error: string | null) => void
  setSuccessMessage?: (message: string | null) => void
}

interface UseSaveScoreReturn {
  playerName: string
  setPlayerName: (name: string) => void
  handleSaveAndRestart: () => Promise<void>
  playerRank: number | null
}

const saveUseCase = new SaveGameScoreUseCase(new FirebaseScoreRepository())

export const useSaveScore = ({
  scoreBoard,
  leaderboardScores,
  setError,
  setSuccessMessage
}: UseSaveScoreProps): UseSaveScoreReturn => {
  const { t } = useTranslation("yams")
  const [playerName, setPlayerName] = useState('')
  const [playerRank, setPlayerRank] = useState<number | null>(null) 

  const [lastSaveTime, setLastSaveTime] = useState<number>(0)

  const handleSaveAndRestart = async () => {
    const now = Date.now()
    if (lastSaveTime > 0 && now - lastSaveTime < 5000) { 
      setError(t(`errors.rateLimitError`))
      return
    }
    setLastSaveTime(now)

    setError(null)
    
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + scoreBoard.getTotalYahtzeeBonus()

    const input: SaveGameScoreInput = {
      playerName,
      score: totalScore,
      yahtzeeBonus: scoreBoard.getTotalYahtzeeBonus()
    }
    
    const result = await saveUseCase.execute(input)

    if (result.success) {  
      const scoresAbove = leaderboardScores.filter(s => s.score > totalScore)
      const distinctScoresAbove = new Set(scoresAbove.map(s => s.score)).size
      const calculatedRank = distinctScoresAbove + 1
      
      setPlayerRank(calculatedRank)
      setSuccessMessage?.(t('ui.scoreSaved'))  
      setPlayerName('')
    } else {
      const errorKey = result.error ?? 'unknownError'
      setError(t(`errors.${errorKey}`))
    }   
  }
  return { playerName, setPlayerName, handleSaveAndRestart, playerRank }
}