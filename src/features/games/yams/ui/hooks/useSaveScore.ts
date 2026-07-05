import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { calculateTotalScore } from "../../domain/rules/calculateScore"
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { FirebaseScoreRepository } from "../../infrastructure/firebase/repositories/FirebaseScoreRepository"
import { FirebaseLeaderboardRepository } from "../../infrastructure/firebase/repositories/FirebaseLeaderboardRepository"
import type { YamsScoreBoard } from "../../domain/valueObjects/YamsScoreBoard"
import type { SaveGameScoreInput } from "../../application/dtos/SaveGameScoreDTO"
import { GetPlayerBestScoreUseCase } from "../../application/usecases/GetPlayerBestScoreUseCase"

export type MessageType = 'validation' | 'success'

export interface Message {
  text: string
  type: MessageType
}

interface UseSaveScoreProps {
  scoreBoard: YamsScoreBoard
  setError: (error: string | null) => void
}

interface UseSaveScoreReturn {
  playerName: string
  setPlayerName: (name: string) => void
  handleSaveAndRestart: () => Promise<void>
  playerRank: number | null
  message: Message | null 
  clearMessage: () => void
}

const saveUseCase = new SaveGameScoreUseCase(new FirebaseScoreRepository())
const leaderboardRepository = new FirebaseLeaderboardRepository()

export const useSaveScore = ({
  scoreBoard,
  setError
}: UseSaveScoreProps): UseSaveScoreReturn => {
  const { t } = useTranslation("yams")
  const [playerName, setPlayerName] = useState('')
  const [playerRank, setPlayerRank] = useState<number | null>(null) 
  const [lastSaveTime, setLastSaveTime] = useState<number>(0)
  const [message, setMessage] = useState<Message | null>(null)

  const getPlayerBestScoreUseCase = useMemo(
    () => new GetPlayerBestScoreUseCase(new FirebaseLeaderboardRepository()),
    []
  )

  const clearMessage = () => setMessage(null)

  const handleSaveAndRestart = async () => {
    const now = Date.now()
    if (lastSaveTime > 0 && now - lastSaveTime < 5000) { 
      setError(t(`errors.rateLimitError`))
      return
    }
    setLastSaveTime(now)

    setError(null)
    clearMessage()
    
    const totalScore = calculateTotalScore(scoreBoard.getAllScores()) + scoreBoard.getTotalYahtzeeBonus()

    try {
      const bestScoreResult = await getPlayerBestScoreUseCase.execute({ playerName })
      
      if (!bestScoreResult.isNewPlayer && totalScore <= bestScoreResult.bestScore!) {
        setMessage({
          text: t('ui.scoreValidation.notBetter'),
          type: 'validation'
        })
        return
      }
    } catch (err) {
      const errorKey = err instanceof Error ? err.name : 'unknownError'
      setError(t(`errors.${errorKey}`))
      return
    }

    const input: SaveGameScoreInput = {
      playerName,
      score: totalScore,
      yahtzeeBonus: scoreBoard.getTotalYahtzeeBonus()
    }
    
    const result = await saveUseCase.execute(input)

    if (result.success) {  
      try {
        const rank = await leaderboardRepository.getPlayerRank(totalScore)
        setPlayerRank(rank)
        setMessage({
          text: t('ui.scoreSaved'),
          type: 'success'
        })
        setPlayerName('')
      } catch (err) {
        const errorKey = err instanceof Error ? err.name : 'unknownError'
        setError(t(`errors.${errorKey}`))
      }
    } else {
      const errorKey = result.error ?? 'unknownError'
      setError(t(`errors.${errorKey}`))
    }   
  }
  return { playerName, setPlayerName, handleSaveAndRestart, playerRank, message, clearMessage }

}