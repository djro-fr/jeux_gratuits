import type { YamsTurn } from "../../domain/entities/YamsTurn"
import { 
  CantRollError, 
  DuplicateDiceIndicesError, 
  InvalidDiceIndicesError, 
  TooManyDiceKeptError 
} from "../errors/YamsErrors"

export class KeepDiceUseCase {
  execute(turn: YamsTurn, indicesToKeep: number[]): YamsTurn {
    const hasNoDuplicates = indicesToKeep.length === new Set(indicesToKeep).size
    if (!hasNoDuplicates) {
      throw new DuplicateDiceIndicesError({
        indices: indicesToKeep
      })
    }
      
    if (indicesToKeep.length > 4) {
      throw new TooManyDiceKeptError({
        count: indicesToKeep.length,
        maxAllowed: 4
      })
    }
        
    const validIndices = indicesToKeep.every(i => i >= 0 && i < 5)
    if (!validIndices) {
      throw new InvalidDiceIndicesError({
        indices: indicesToKeep,
        validRange: [0, 4]
      })
    }
        
    if (!turn.canRoll()) {
      throw new CantRollError({
        rollNumber: turn.getRollNumber(),
        maxRolls: 3
      })
    }

    const indicesToRoll = [0, 1, 2, 3, 4].filter(i => !indicesToKeep.includes(i))  
    return turn.nextRoll(indicesToRoll)
  }
}