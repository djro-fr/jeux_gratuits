import { useTranslation } from "react-i18next"
import type { YamsScoreBoard } from "../../application/entities/YamsScoreBoard"
import { YamsCategory } from "../../domain/rules/calculateScore"

interface ScoreBoardProps {
  scoreBoard: YamsScoreBoard
  selectedCategory: YamsCategory | null
  onSelectCategory: (category: YamsCategory) => void
}

export const ScoreBoard = ({
  scoreBoard,
  selectedCategory,
  onSelectCategory
}: ScoreBoardProps) => {
  const { t } = useTranslation('yams')

  const categories = Object.values(YamsCategory)

  return (
    <div className="scoreboard">
      {categories.map((category) => {
        const score = scoreBoard.getScore(category)
        const isScored = score !== null
        const isSelected = selectedCategory === category

        return (
          <button
            key={category}
            onClick={() => !isScored && onSelectCategory(category)}
            disabled={isScored}
            className={`category ${isSelected ? 'selected' : ''} ${isScored ? 'scored' : ''}`}
          >
            <span className="name">{t(`categories.${category}`)}</span>
            <span className="score">{isScored ? score : '-'}</span>
          </button>
        )
      })}
    </div>
  )
}