import { GameAlreadyFinishedError } from "../errors/YamsErrors"
import { DiceRoll } from "./DiceRoll"
import { YamsGame } from "./YamsGame"
import { YamsTurn } from "./YamsTurn"

describe("Domain unit tests (YamsGame entity)", () => {
  describe("1) Valid YamsGame ", () => {
    it("1.1) Default constructor ", () => {
      const game = new YamsGame()      
      const turn = game.getCurrentTurn()  
      expect(turn.getRollNumber()).toBe(1)
      expect(game.getValidatedTurns()).toHaveLength(0)
    })    
    it("1.2) Constructor with custom turn", () => {      
      const turn = new YamsTurn(2)      
      const game = new YamsGame(turn)
      expect(game.getCurrentTurn().getRollNumber()).toBe(2)            
      expect(game.getValidatedTurns()).toHaveLength(0)
    })    
    it("1.3) Constructor with custom turn and validated turn", () => {      
      const roll = new DiceRoll()
      const turn = new YamsTurn(2, roll)   
      const validTurns = [{ turn: turn, finalDice: roll.getDice() }]
      const game = new YamsGame(turn, 2, validTurns)
      expect(game.getCurrentTurn()).toBe(turn)
      expect(game.getValidatedTurns()).toHaveLength(1)
      expect(game.getGameTurnNumber()).toBe(2)
      expect(game.getValidatedTurns()).toHaveLength(1)
    })
  })  
  describe("2) ValidateTurn", () => {    
    it("2.1) Normal progression", () => {
      const turn1 = new YamsTurn(1)
      const game1 = new YamsGame(new YamsTurn(1))

      const turn2 = turn1.nextRoll([0,2])
      const turn3 = turn2.nextRoll([1])
      const finalDice = turn3.getDiceRoll().getDice()
      
      const game2 = game1.validateTurn(finalDice)
      
      expect(game1.getCurrentTurn().getRollNumber()).toBe(1)
      expect(game1.getGameTurnNumber()).toBe(1)
      expect(game1.getValidatedTurns()).toHaveLength(0)
      
      expect(game2.getCurrentTurn().getRollNumber()).toBe(1)
      expect(game2.getGameTurnNumber()).toBe(2)
      expect(game2.getValidatedTurns()).toHaveLength(1)
      expect(game2.getValidatedTurns()[0].finalDice).toBe(finalDice)
    })
    it("2.2) Error if game finished", () => {
      const turn = new YamsTurn(1)
      const dice = turn.getDiceRoll().getDice()
      let game = new YamsGame(turn)

      for (let i = 0; i < 13; i++) {
        const newDice = new DiceRoll().getDice() 
        game = game.validateTurn(newDice)
      }
      
      expect(game.isGameFinished()).toBe(true)      
      expect(() => game.validateTurn(dice)).toThrow(GameAlreadyFinishedError)
    })
    
    it("2.3) Progression up to 13 turns", () => {
      const turn = new YamsTurn(1)
      let game = new YamsGame(turn)

      for (let i = 0; i < 13; i++) {
        const newDice = new DiceRoll().getDice() 
        game = game.validateTurn(newDice)
      }      
      expect(game.getValidatedTurns()).toHaveLength(13)
      expect(game.isGameFinished()).toBe(true)      
      expect(game.getGameTurnNumber()).toBe(13)
    })

  })
})