import type { YamsTurn } from "../../domain/entities/YamsTurn";
import { CantRollError, DuplicateDiceIndicesError, InvalidDiceIndicesError, TooManyDiceKeptError } from "../../domain/errors/YamsErrors";

export class KeepDiceUseCase {
  execute(turn: YamsTurn, indicesToKeep: number[]): YamsTurn {
    const hasNoDuplicates = indicesToKeep.length === new Set(indicesToKeep).size
    if (!hasNoDuplicates) throw new DuplicateDiceIndicesError()
      
    if (indicesToKeep.length > 4) throw new TooManyDiceKeptError(indicesToKeep.length)
        
    const validIndices = indicesToKeep.every(i => i >= 0 && i < 5)
    if (!validIndices) throw new InvalidDiceIndicesError()
        
    if (!turn.canRoll()) throw new CantRollError()
    return turn.nextRoll(indicesToKeep)
  }
}