import { useEffect, useState } from "react"
import { GetLeaderboardUseCase, type LeaderboardScore} from "../../application/usecases/GetLeaderboardUseCase"
import { useTranslation } from "react-i18next"

export const GlobalLeaderboard = () => {
  const { t } = useTranslation('yams')
  const [scores, setScores] = useState<LeaderboardScore[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const usecase = new GetLeaderboardUseCase()
    
    const unsubscribe = usecase.execute((leaderboard) => {
      setScores(leaderboard)
      setLoading(false)
    })    
    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="leaderboard-loading">
        <p>{t('ui.loading')}</p>
      </div>
    )
  }

  if (scores.length === 0) {
    return (
      <div className="leaderboard-empty">
        <p className="text-white text-2xl italic" >{t('ui.noScores')}</p>
      </div>
    )
  }

  return (
    <div className="leaderboard text-white pb-30">
      <h2>{t('ui.globalLeaderboard')}</h2>
      <div className="rounded-t-[20px] bg-white">
        <table className="w-full mt-6">
          <thead>
            <tr className="font-action text-xl text-gold-dark">
              <th className="text-left p-2">#</th>
              <th className="text-left p-2">{t('ui.player')}</th>
              <th className="text-right p-2">{t('ui.score')}</th>
            </tr>
          </thead>
          <tbody className="bg-green-carpet">
            {scores.map((score) => (
              <tr key={score.rank} className="border-b hover:bg-green-carpet-dark">
                <td className="text-center p-2">
                  {score.rank === 1}
                  {score.rank === 2}
                  {score.rank === 3}
                  {score.rank > 3 && score.rank}
                </td>
                <td className="p-2 text-3xl">{score.playerName}</td>
                <td className="text-right p-2 font-bold text-3xl">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}