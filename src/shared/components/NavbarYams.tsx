
import { LeaderboardModal } from '@/features/games/yams/ui/components/LeaderboardModal'
import { useYamsGame } from '@/features/games/yams/ui/hooks/useYamsGame'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { IconsSprite } from './IconsSprite'

export const NavbarYams = () => {
  const { handleRestart } = useYamsGame()
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)

  return (    
    <>
    <nav id="navbar" className='py-2.5'>
      <div className="container mx-auto flex">
        <ul className="flex justify-between w-full px-5">
          <li>
            <Link to="/">
            <button className='icon' onClick={handleRestart}>
              <IconsSprite value='home'/>              
            </button>
            </Link>
          </li>
          <li>
            <button className='icon' onClick={handleRestart}>
              <IconsSprite value='restart'/>              
            </button>
          </li>
          <li>
            <button className='icon' onClick={() => setIsLeaderboardOpen(true)}>
              <IconsSprite value='leaderboard'/>              
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