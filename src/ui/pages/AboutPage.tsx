
import { useTranslation } from 'react-i18next'

export const AboutPage = () => {
  const { t } = useTranslation()
  return (    
    <div className="max-w-80 w-full mx-auto">
      <h1 className='mb-2'>{t('about.title')}</h1>
      <p className='mb-4'>{t('about.p1')}</p>
      <p className='mb-4'>{t('about.p2')}</p>
      <p className='mb-4'>{t('about.p3')}</p>
      <p className='mb-4'>{t('about.p4')}</p>
      <a href='https://www.linkedin.com/in/sylvain-girault-83092340/' target='_blank' className='mt-50'>Contact</a>
    </div>  
  )
}
