import { useTranslation } from 'react-i18next'
import type { Die } from '../../domain/entities/Die'
import { DICE_SVGS } from '../utils/diceAssets'

interface DiceDisplayProps {
  dice: Die[] | undefined
  selectedIndices: number[]
  onSelectDice: (indices: number[]) => void
  rollNumber?: number
}

export const DiceDisplay = ({
  dice,
  selectedIndices,
  onSelectDice,
  rollNumber
}: DiceDisplayProps) => {

  const { t } = useTranslation('yams') 

  const handleDiceClick = (index: number) => {
    if (selectedIndices.includes(index)) {
      onSelectDice(selectedIndices.filter(i => i !== index))
    } else {
      onSelectDice([...selectedIndices, index])
    }
  }

  return (
    <div className="dice-display">
      {!!rollNumber && <p>{t('ui.rollNumber')} {rollNumber}/3</p>}
      
      <div className="dice-container">
        {dice?.map((die, index) => (          
          <button
          key={`die-${index}-${die.getValue()}`}
          onClick={() => handleDiceClick(index)}
          className={`die ${selectedIndices.includes(index) ? 'selected' : ''}`}
        >
          <img
            src={DICE_SVGS[die.getValue()]}
            alt={`die ${die.getValue()}`}
          />
        </button>
        ))}
      </div>
    </div>
  )
}
