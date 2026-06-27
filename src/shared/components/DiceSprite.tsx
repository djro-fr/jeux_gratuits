import type { HTMLAttributes } from 'react'

type DiceValue = 1 | 2 | 3 | 4 | 5 | 6

interface DiceSpriteProps extends HTMLAttributes<SVGSVGElement> {
  value: DiceValue
}

export const DiceSprite = ({ 
  value,
  ...props 
}: DiceSpriteProps) => (
  <svg 
    viewBox="0 0 20 20"
    {...props}
  >
    <use href={`/assets/dice-sprite.svg#dice-${value}`} />
  </svg>
)