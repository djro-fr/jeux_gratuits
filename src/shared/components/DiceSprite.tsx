import type { HTMLAttributes } from 'react'

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

interface DiceSpriteProps extends HTMLAttributes<SVGSVGElement> {
  value: DiceValue,
  isAnimating: boolean
}

export const DiceSprite = ({ 
  value,
  isAnimating,
  ...props 
}: DiceSpriteProps) => (
  <svg 
    viewBox="0 0 20 20"
    {...props}
  >
    <use href={`#dice-${isAnimating ? 0 : value}`} />
  </svg>
)
 


