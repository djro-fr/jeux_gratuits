
import { YamsGameContainer } from '@/features/games/yams/ui/containers/YamsGameContainer'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

interface GamePageParams extends Record<string, string | undefined> {
  gameId: string
}

export const GamePage = () => {
  const { t } = useTranslation()
  const { gameId } = useParams<GamePageParams>()
  return (
    <div className="container">
      {gameId === 'yams' && <YamsGameContainer />}
      {gameId !== 'yams' && <div>{t('game.notFound', { gameId })}</div>}
    </div>
  )
}
