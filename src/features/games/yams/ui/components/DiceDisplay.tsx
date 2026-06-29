import { useTranslation } from 'react-i18next'
import type { Die } from '../../domain/valueObjects/Die'
import { DiceSprite } from '@/shared/components/DiceSprite'


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
      <div className="text-center mt-1">{!!rollNumber && <p className='text-primary-light'>{t('ui.rollNumber')} {rollNumber}/3</p>}</div>
      
      <div className="dice-container">
        {dice?.map((die, index) => (          
          <button
          key={`die-${rollNumber}-${index}`}
          onClick={() => handleDiceClick(index)}
          className={`die ${selectedIndices.includes(index) ? 'selected' : ''}`}
        >
        <DiceSprite 
          value={die.getValue() as 1 | 2 | 3 | 4 | 5 | 6}
        />
        </button>
        ))}
      </div>
    </div>
  )
}
