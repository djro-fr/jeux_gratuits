import { useParams } from 'react-router-dom'

export default function GamePage() {
  const { gameId } = useParams()
  return (
    <div className='container'>
      <div>Game: {gameId}</div>
    </div>
  )
}