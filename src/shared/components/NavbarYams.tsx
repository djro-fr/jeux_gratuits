
import { LeaderboardModal } from '@/features/games/yams/ui/components/LeaderboardModal'
import { useYamsGame } from '@/features/games/yams/ui/hooks/useYamsGame'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const NavbarYams = () => {
  const {t} = useTranslation("yams")
  const { handleRestart } = useYamsGame()
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  return (    
    <>
    <nav id="navbar">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex gap-8">
          <li>
            <Link to="/">
              H
            </Link>
          </li>
          <li>
            <button onClick={handleRestart}>
              {t("ui.restart")}
            </button>
          </li>
          <li>
            <button 
              onClick={() => setIsLeaderboardOpen(true)}
              className="hover:opacity-80 transition"
            >
              {t("ui.leaderboard")}
            </button>
          </li>
        </ul>
      </div>   
    </nav>
    <LeaderboardModal
      isOpen={isLeaderboardOpen}
      onClose={() => setIsLeaderboardOpen(false)}
    />
    </>
    )
}