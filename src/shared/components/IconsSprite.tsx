import type { HTMLAttributes } from 'react'

type IconsValue = "reroll" | "score" | "roll" | "back" | "github" | "check" | "leaderboard" | "restart" | "home" 

interface IconsSpriteProps extends HTMLAttributes<SVGSVGElement> {
  value: IconsValue
}

export const IconsSprite = ({ 
  value,
  ...props 
}: IconsSpriteProps) => (
  <svg 
    viewBox="0 0 32 32"
    {...props}
  >
    <use href={`/assets/icons-sprite.svg#${value}`} />
  </svg>
)