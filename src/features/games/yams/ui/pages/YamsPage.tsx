import { useTranslation } from 'react-i18next'
import { YamsGameContainer } from '../containers/YamsGameContainer'

export const YamsPage = () => {
    const { t } = useTranslation('yams')
  return (
    <div id='yams-page' className="green-carpet">
      <h1>{t("title")}</h1>
      <YamsGameContainer />
    </div>
  )
}