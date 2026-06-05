import { DiceRoll } from "./DiceRoll";
import { MaxTurnsReachedError } from "../errors/YamsErrors";

export class YamsTurn {
  private readonly turnNumber: number;
  private readonly diceRoll: DiceRoll;

  constructor(turnNumber: number = 1, diceRoll?: DiceRoll) {
    this.turnNumber = turnNumber;
    this.diceRoll = diceRoll || new DiceRoll();
  }

  getTurnNumber() : number {
    return this.turnNumber
  }

  getDiceRoll(): DiceRoll {
    return this.diceRoll
  }
  
  canRoll(): boolean {
    return this.turnNumber < 3        
  }

  nextRoll(indices?: number[]): YamsTurn {
    if (this.canRoll()) {
      if (indices) {
        return new YamsTurn(this.turnNumber, this.diceRoll.reroll(indices));
      }else{
        return new YamsTurn(this.turnNumber + 1);
      }
    }
    throw new MaxTurnsReachedError();
  }


}
