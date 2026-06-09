import { DiceRoll } from "./DiceRoll";
import { MaxTurnsReachedError } from "../errors/YamsErrors";

export class YamsTurn {
  private readonly rollNumber: number;
  private readonly diceRoll: DiceRoll;

  constructor(rollNumber: number = 1, diceRoll?: DiceRoll) {
    this.rollNumber = rollNumber;
    this.diceRoll = diceRoll || new DiceRoll();
  }

  getRollNumber() : number {
    return this.rollNumber
  }

  getDiceRoll(): DiceRoll {
    return this.diceRoll
  }
  
  canRoll(): boolean {
    return this.rollNumber < 3        
  }

  nextRoll(indices?: number[]): YamsTurn {
    if (this.canRoll()) {
      if (indices) {
        return new YamsTurn(this.rollNumber, this.diceRoll.reroll(indices));
      }else{
        return new YamsTurn(this.rollNumber + 1);
      }
    }
    throw new MaxTurnsReachedError();
  }


}
