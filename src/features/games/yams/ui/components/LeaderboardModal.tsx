import { useTranslation } from "react-i18next"
import { useLeaderboard } from "../hooks/useLeaderboard"
import { Modal } from "@/shared/components/Modal"

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

const LeaderboardContent = () => {
  const { t } = useTranslation('yams')
  const { scores, loading } = useLeaderboard()

  if (loading) {
    return <p className="text-center text-white bg-green-carpet text-lg">{t('ui.loading')}</p>
  }

  if (scores.length === 0) {
    return <p className="text-white bg-green-carpet text-xl italic text-center">{t('ui.noScores')}</p>
  }

  return (
    <div className="leaderboard rounded-lg overflow-hidden bg-green-carpet">
      <table className="w-full">
        <thead>
          <tr className=" bg-white font-action text-lg text-gold-dark">
            <th className="text-left p-2 pl-3">#</th>
            <th className="text-center p-2">{t('ui.player')}</th>
            <th className="text-right p-2 pr-3">{t('ui.score')}</th>
          </tr>
        </thead>
        <tbody className="bg-green-carpet font-content">
          {scores.map((score) => (
            <tr key={score.rank} className="hover:bg-green-carpet-dark">
              <td className="text-left p-2 pl-3 text-xl font-bold">{score.rank}</td>
              <td className="p-2 text-center text-xl">{score.playerName}</td>
              <td className="text-right p-2 pr-3 font-bold text-xl">{score.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const LeaderboardModal = ({ isOpen, onClose }: LeaderboardModalProps) => {
  const { t } = useTranslation('yams')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('ui.globalLeaderboard')}
    >
      <div className="text-white">
        <LeaderboardContent />
      </div>
    </Modal>
  )
}