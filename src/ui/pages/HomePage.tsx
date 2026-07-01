import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const { t } = useTranslation()
  const { t: tYams } = useTranslation('yams')
  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <h1 className='mb-2 text-5xl'>{t('games')}</h1>
      <img src="../assets/dicesplash.jpg" className='w-full mt-1 mb-5' alt="" />
      <div className='flex w-full justify-center'>
        <Link to="/game/yams">{tYams('title')}</Link>
      </div>
    </div>
  )
}