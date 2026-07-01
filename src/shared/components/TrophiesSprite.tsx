import type { HTMLAttributes } from 'react'

type TrophiesValue = "gold" | "silver" | "bronze"

interface TrophiesSpriteProps extends HTMLAttributes<SVGSVGElement> {
  value: TrophiesValue
}

export const TrophiesSprite = ({ 
  value,
  ...props 
}: TrophiesSpriteProps) => (
  <svg 
    viewBox="0 0 800 800"
    {...props}
  >
    <use href={`/assets/trophies-sprite.svg#${value}`} />
  </svg>
)