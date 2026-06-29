import { useEffect, useState } from "react"
import { GetLeaderboardUseCase } from "../../application/usecases/GetLeaderboardUseCase"
import { FirebaseLeaderboardRepository } from "../../infrastructure/firebase/repositories/FirebaseLeaderboardRepository"
import type { LeaderboardScore } from "../../domain/repositories/ILeaderboardRepository"

interface UseLeaderboardReturn {
  scores: LeaderboardScore[]
  loading: boolean
}

export const useLeaderboard = (): UseLeaderboardReturn => {
  const [scores, setScores] = useState<LeaderboardScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = new GetLeaderboardUseCase(
      new FirebaseLeaderboardRepository()
    ).execute((leaderboard) => {
      setScores(leaderboard)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { scores, loading }
}