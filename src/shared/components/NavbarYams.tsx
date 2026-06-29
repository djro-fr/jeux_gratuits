import { Link, useNavigate } from 'react-router-dom'
import { IconsSprite } from './IconsSprite'
import { useState } from 'react'
import { LeaderboardModal } from '@/features/games/yams/ui/components/LeaderboardModal'

export const NavbarYams = () => {
  const navigate = useNavigate()  
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false)
  
  const handleRestart = () => {
    navigate(0)  
  }
  
  return (    
    <>
      <nav id="navbar" className='py-2.5'>
        <div className="container mx-auto flex">
          <ul className="flex justify-between w-full px-5">
            <li>
              <Link to="/">
                <button className='icon'>
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