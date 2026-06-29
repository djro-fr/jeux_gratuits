import { GameAlreadyFinishedError } from "../errors/YamsErrors"
import { DiceRoll } from "../valueObjects/DiceRoll"
import { YamsGame } from "./YamsGame"
import { YamsTurn } from "../valueObjects/YamsTurn"
import { YamsScoreBoard } from "../valueObjects/YamsScoreBoard"

describe("Domain unit tests (YamsGame aggregate root)", () => {
  describe("1) Valid YamsGame", () => {
    it("1.1) Default constructor", () => {
      const game = new YamsGame()      
      const turn = game.getCurrentTurn()  
      expect(turn.getRollNumber()).toBe(1)
      expect(game.getValidatedTurns()).toHaveLength(0)
      expect(game.getGameTurnNumber()).toBe(1)
    })    
    it("1.2) Constructor with custom turn", () => {      
      const turn = new YamsTurn(2)      
      const game = new YamsGame(undefined, turn) 
      expect(game.getCurrentTurn().getRollNumber()).toBe(2)            
      expect(game.getValidatedTurns()).toHaveLength(0)
    })    
    it("1.3) Constructor with all params", () => {      
      const scoreBoard = YamsScoreBoard.create()
      const roll = new DiceRoll()
      const turn = new YamsTurn(2, roll)   
      const validTurns = [{ turn: turn, finalDice: roll.getDice() }]
      const game = new YamsGame(scoreBoard, turn, 2, validTurns) 
      expect(game.getCurrentTurn()).toBe(turn)
      expect(game.getValidatedTurns()).toHaveLength(1)
      expect(game.getGameTurnNumber()).toBe(2)
    })
  })
  describe("2) ValidateTurn", () => {    
    it("2.1) Normal progression", () => {
      const turn1 = new YamsTurn(1)
      const game1 = new YamsGame(undefined, new YamsTurn(1))
  
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
      expect(game2.getValidatedTurns()[0].finalDice).toEqual(finalDice) 
    })
    
    it("2.2) Error if game finished", () => {
      const turn = new YamsTurn(1)
      const dice = turn.getDiceRoll().getDice()
      let game = new YamsGame(undefined, turn) 
  
      for (let i = 0; i < 13; i++) {
        const newDice = new DiceRoll().getDice() 
        game = game.validateTurn(newDice)
      }
      
      expect(game.isGameFinished()).toBe(true)      
      expect(() => game.validateTurn(dice)).toThrow(GameAlreadyFinishedError)
    })
    
    it("2.3) Progression up to 13 turns", () => {
      const turn = new YamsTurn(1)
      let game = new YamsGame(undefined, turn)
  
      for (let i = 0; i < 13; i++) {
        const newDice = new DiceRoll().getDice() 
        game = game.validateTurn(newDice)
      }      
      expect(game.getValidatedTurns()).toHaveLength(13)
      expect(game.isGameFinished()).toBe(true)      
      expect(game.getGameTurnNumber()).toBe(13)
    })
    
    it("2.4) validateTurn returns new instance", () => {
      const game1 = new YamsGame()
      const dice = new DiceRoll().getDice()
      const game2 = game1.validateTurn(dice)
      
      expect(game1).not.toBe(game2)
      expect(game1.getGameTurnNumber()).toBe(1)
      expect(game2.getGameTurnNumber()).toBe(2)
    })
    
    it("2.5) getValidatedTurns returns defensive copy", () => {
      const game = new YamsGame()
      const dice = new DiceRoll().getDice()
      const game2 = game.validateTurn(dice)
      
      const turns1 = game2.getValidatedTurns()
      const turns2 = game2.getValidatedTurns()
      
      expect(turns1).not.toBe(turns2)  
      expect(turns1).toEqual(turns2)   
    })
    
    it("2.6) currentTurn rollNumber stays 1 until game finished", () => {
      const turn1 = new YamsTurn(1)
      let game = new YamsGame(undefined, turn1)
      
      for (let i = 0; i < 12; i++) {
        const dice = new DiceRoll().getDice()
        game = game.validateTurn(dice)
        expect(game.getCurrentTurn().getRollNumber()).toBe(1)  // ← Vérifier rollNumber, pas identité
      }
    
      game = game.validateTurn(new DiceRoll().getDice())
      expect(game.getCurrentTurn().getRollNumber()).toBe(1)  // ← Toujours 1 après 13e
      expect(game.isGameFinished()).toBe(true)
    })    
  })
  describe("3) Game state queries", () => {
    describe("canRoll()", () => {
      it("3.1) returns true if game not finished and turn is fresh", () => {
        const game = new YamsGame()
        expect(game.canRoll()).toBe(true)
      })
      
      it("3.2) returns false if turn already started", () => {
        const turn = new YamsTurn(2)
        const game = new YamsGame(undefined, turn)
        expect(game.canRoll()).toBe(false)
      })
      
      it("3.3) returns false if game finished", () => {
        let game = new YamsGame()
        for (let i = 0; i < 13; i++) {
          game = game.validateTurn(new DiceRoll().getDice())
        }
        expect(game.canRoll()).toBe(false)
      })
    })
    
    describe("canReroll()", () => {
      it("3.4) returns true if rollNumber is 2", () => {
        const turn = new YamsTurn(2)
        const game = new YamsGame(undefined, turn)
        expect(game.canReroll()).toBe(true)
      })
      
      it("3.5) returns false if rollNumber is 1", () => {
        const game = new YamsGame()
        expect(game.canReroll()).toBe(false)
      })
      
      it("3.6) returns false if rollNumber is 3", () => {
        const turn = new YamsTurn(3)
        const game = new YamsGame(undefined, turn)
        expect(game.canReroll()).toBe(false)
      })
    })
    
    describe("canScore()", () => {
      it("3.7) returns true if rollNumber >= 1", () => {
        const game = new YamsGame()
        expect(game.canScore()).toBe(true)
      })
      
      it("3.8) returns true if rollNumber is 2", () => {
        const turn = new YamsTurn(2)
        const game = new YamsGame(undefined, turn)
        expect(game.canScore()).toBe(true)
      })
    })
  })
})