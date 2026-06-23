import { useTranslation } from "react-i18next"
import { YamsScoreBoard } from "../../application/entities/YamsScoreBoard"
import { calculateScoreByCategory, YamsCategory } from "../../domain/rules/calculateScore"
import type { Die } from "../../domain/entities/Die"
import { explainScore } from "../../domain/rules/explainScore"
import { useState } from "react"

interface ScoreBoardProps {
  scoreBoard: YamsScoreBoard
  selectedCategory: YamsCategory | null
  onSelectCategory: (category: YamsCategory) => void
  onScore: (category: YamsCategory) => void
  onClose: () => void 
  dice?: Die[]
}

export const ScoreBoard = ({
  scoreBoard,
  selectedCategory,
  onSelectCategory,
  onScore,
  onClose,
  dice
}: ScoreBoardProps) => {
  const { t } = useTranslation('yams')

  const categories = Object.values(YamsCategory)

  const getScorePreview = (category: YamsCategory): string => {
    if (!dice) return '-'
    
    const score = calculateScoreByCategory(category, dice)
    return score === null ? '-' : score.toString()
  }

  const [showExplanation, setShowExplanation] = useState(false)

  const getScoreExplanation = (): string[] => {
    if (!selectedCategory || !dice) return ['']
    return explainScore(selectedCategory, dice)
  }

  return (
    <div className="scoreboard">
        <div className="buttons">        
          <button 
            className="action second" 
            onClick={onClose}
          >
            &lt; { t('ui.cancel')}
          </button>

          <button 
            className="action ml-5" 
            onClick={() => selectedCategory && onScore(selectedCategory)}
          >
            + { t('ui.score')}
          </button>
      </div>
      <div className="scores">
        {categories.map((category) => {
          const currentScore = scoreBoard.getScore(category)          
          const isScored = currentScore  !== null
          const isSelected = selectedCategory === category
          const previewScore = isSelected ? getScorePreview(category) : "-"
          const categoryLabel = t(`categories.${category}`)
          const ariaLabel = `Expliquer ${categoryLabel}`

          return (
            <div key={category}>
              <div className="line-score">                
                <button
                  onClick={() => !isScored && onSelectCategory(category)}
                  disabled={isScored}
                  className={`category flex-1 ${isSelected ? 'selected' : ''} ${isScored ? 'scored' : ''}`}
                >
                  <span className="name">{t(`categories.${category}`)}</span>
                  <span className="score">
                    {isScored ? (<strong>{currentScore}</strong>) : (<em>{previewScore}</em>)}
                  </span>
                </button>                
                
                {isSelected && <button
                  className="help"
                  onClick={() => setShowExplanation(!showExplanation)}
                  aria-label={ariaLabel}
                >
                  ?
                </button>
                }
              </div>
              
              {isSelected && showExplanation && (              
                <div className="explanation">              
                  <p>{getScoreExplanation()[0]}</p> 
                  {getScoreExplanation()[1] && <p>{getScoreExplanation()[1]}</p>}    
                  {getScoreExplanation()[2] && <p>{getScoreExplanation()[2]}</p>}   
                </div>              
              )}
            </div>
          )
          

        })}
      </div>

    </div>
  )
}