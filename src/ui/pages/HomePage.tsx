import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const { t } = useTranslation()
  const { t: tYams } = useTranslation('yams')
  return (
    <div>
      <h1 className='text-bold'>{t('games')}</h1>
      
      <Link to="/game/yams">{tYams('title')}</Link>
    </div>
  )
}