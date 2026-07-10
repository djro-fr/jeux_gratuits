import { useTranslation } from "react-i18next"
import { YamsCategory } from "../../domain/rules/calculateScore"
import type { YamsScoreBoard } from "../../domain/valueObjects/YamsScoreBoard"

interface CategoriesScoredTopProps {
  scoreBoard: YamsScoreBoard
}

export const CategoriesScoredTop = ({scoreBoard} : CategoriesScoredTopProps ) => {

  const {t} = useTranslation("yams")  
  const categories = Object.values(YamsCategory)
  
  return (
    <div id="score-check-top"  className="score-check flex flex-1 justify-center items-center">
      <div className="score-check_line flex flex-wrap justify-center gap-2.5">        
        {categories.map((category, index) => {
          const currentScore = scoreBoard.getScore(category)          
          const isScored = currentScore  !== null
          return index <= 5 ? (
            <span key={category} className={`border border-white text-white px-3 py-2 rounded-xl font-action ${isScored ? 'strike-through opacity-50' : ''}`}>{t(`categories.${category}`)}</span>
          ) : null
        })}
      </div>
    </div>
    
  )
}