import { useTranslation } from "react-i18next"
import { YamsScoreBoard } from "../../application/entities/YamsScoreBoard"
import { calculateScoreByCategory, YamsCategory } from "../../domain/rules/calculateScore"
import type { Die } from "../../domain/entities/Die"

interface ScoreBoardProps {
  scoreBoard: YamsScoreBoard
  selectedCategory: YamsCategory | null
  onSelectCategory: (category: YamsCategory) => void
  onScore: (category: YamsCategory) => void
  dice?: Die[]
}

export const ScoreBoard = ({
  scoreBoard,
  selectedCategory,
  onSelectCategory,
  onScore,
  dice
}: ScoreBoardProps) => {
  const { t } = useTranslation('yams')

  const categories = Object.values(YamsCategory)

  const getScorePreview = (category: YamsCategory): string => {
    if (!dice) return '-'
    
    const score = calculateScoreByCategory(category, dice)
    return score === null ? '-' : score.toString()
  }

  return (
    <div className="scoreboard">
      <div>
        {categories.map((category) => {
          const currentScore = scoreBoard.getScore(category)          
          const isScored = currentScore  !== null
          const isSelected = selectedCategory === category
          const previewScore = isSelected ? getScorePreview(category) : "-"

          return (
            <button
              key={category}
              onClick={() => !isScored && onSelectCategory(category)}
              disabled={isScored}
              className={`category ${isSelected ? 'selected' : ''} ${isScored ? 'scored' : ''}`}
            >
              <span className="name">{t(`categories.${category}`)}</span>
              <span className="score">{isScored ? (<strong>{currentScore}</strong>) : (<em>{previewScore}</em>)}</span>
            </button>
          )
        })}
      </div>
      
      <button 
        className="action ml-2" 
        onClick={() => selectedCategory && onScore(selectedCategory)}
      >
        {t('ui.score')}
      </button>
    </div>
  )
}