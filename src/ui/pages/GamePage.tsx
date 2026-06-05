import { useParams } from 'react-router-dom'

interface GamePageParams extends Record<string, string | undefined> {
  gameId: string
}

export const GamePage = () => {
  const { gameId } = useParams<GamePageParams>()
  return (
    <div className="container">
      <div>Game: {gameId}</div>
    </div>
  )
}
