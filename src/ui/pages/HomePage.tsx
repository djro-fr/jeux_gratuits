import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export const HomePage = () => {
  const { t } = useTranslation()
  const { t: tYams } = useTranslation('yams')
  return (
    <div className='flex flex-col w-full h-full mb-5 items-center'>
      <h1 className='-mb-7 text-5xl'>{t('games')}</h1>
      <h2 className='mb-2 text-large font-content italic'>v1.1.4</h2>
      <div className='flex flex-col justify-center flex-1 h-[10vh] mb-18'>
        <img src="../assets/dicesplash.jpg" className='max-h-[75vh] mt-1 mb-2' alt="" />
        <div className='flex w-full justify-center'>
          <Link to="/game/yams">{tYams('title')}</Link>
        </div>
      </div>
    </div>
  )
}