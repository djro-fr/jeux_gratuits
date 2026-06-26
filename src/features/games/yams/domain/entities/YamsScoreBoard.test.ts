
import { CategoryAlreadyScoredError } from "../../application/errors/YamsErrors"
import { YamsCategory } from "../../domain/rules/calculateScore"
import { YamsScoreBoard } from "./YamsScoreBoard"


describe("Application unit tests (YamsScoreBoard entity)", () => {
  describe("1) Valid YamsScoreBoard", () => {
    it("1.1) Default constructor", () => {
      const scoreBoard = YamsScoreBoard.create()            
      const scores = scoreBoard.getAllScores()
      Object.values(scores).forEach(score => {
        expect(score).toBe(null)
      })
    })    
  })    

  describe("2) canScore", () => {
    it("2.1) returns true if score empty", () => {
      const scoreBoard = YamsScoreBoard.create()      
      expect(scoreBoard.canScore(YamsCategory.Ones)).toBe(true)
    })    
    it("2.2) returns false if score filled", () => {
      const scoreBoard1 = YamsScoreBoard.create()  
      const scoreBoard2 = scoreBoard1.addScore(YamsCategory.Ones, 50)    
      expect(scoreBoard2.canScore(YamsCategory.Ones)).toBe(false)
    })
  })
  
  describe("3) addScore", () => {
    it("3.1) returns a new YamsScoreBoard instance", () => {
      const scoreBoard1 = YamsScoreBoard.create()  
      const scoreBoard2 = scoreBoard1.addScore(YamsCategory.Ones, 50)    
      expect(scoreBoard1).not.toBe(scoreBoard2)       
      expect(scoreBoard2.getScore(YamsCategory.Ones)).toBe(50)
    })        
    it("3.2) original scoreBoard is not modified", () => {
      const scoreBoard1 = YamsScoreBoard.create()  
      const scoreBoard2 = scoreBoard1.addScore(YamsCategory.Ones, 50)      
      expect(scoreBoard2.getScore(YamsCategory.Ones)).toBe(50)   
      expect(scoreBoard1.getScore(YamsCategory.Ones)).toBe(null)
    })        
    it("3.3) throws CategoryAlreadyScoredError", () => {      
      const scoreBoard1 = YamsScoreBoard.create()  
      const scoreBoard2 = scoreBoard1.addScore(YamsCategory.Ones, 50)                    
      expect(() => scoreBoard2.addScore(YamsCategory.Ones, 50)).toThrow(CategoryAlreadyScoredError)
    })  
  })

  describe("4) getScore", () => {
    it("4.1) returns the score for a category", () => {
      const scoreBoard1 = YamsScoreBoard.create()  
      const scoreBoard2 = scoreBoard1.addScore(YamsCategory.Ones, 50)       
      expect(scoreBoard1.getScore(YamsCategory.Ones)).toBe(null)
      expect(scoreBoard2.getScore(YamsCategory.Ones)).toBe(50)
    })   
  })
  
  describe("5) getAllScores", () => {
    it("5.1) returns a new instance of scoreboard", () => {
      const scoreBoard = YamsScoreBoard.create().addScore(YamsCategory.Ones, 50)  
      const scores = scoreBoard.getAllScores()
      scores[YamsCategory.Ones] = 145

      expect(scoreBoard.getAllScores()[YamsCategory.Ones]).not.toBe(145)
    })   
  })

  describe("6) addYahtzeeBonus", () => {
    it("6.1) adds bonus to scoreBoard", () => {
      const scoreBoard1 = YamsScoreBoard.create()
      const scoreBoard2 = scoreBoard1.addYahtzeeBonus(100)
      
      expect(scoreBoard1.getTotalYahtzeeBonus()).toBe(0)
      expect(scoreBoard2.getTotalYahtzeeBonus()).toBe(100)
    })
  
    it("6.2) accumulates multiple bonuses", () => {
      const scoreBoard1 = YamsScoreBoard.create()
      const scoreBoard2 = scoreBoard1.addYahtzeeBonus(100)
      const scoreBoard3 = scoreBoard2.addYahtzeeBonus(100)
      
      expect(scoreBoard3.getTotalYahtzeeBonus()).toBe(200)
    })
  
    it("6.3) returns a new instance", () => {
      const scoreBoard1 = YamsScoreBoard.create()
      const scoreBoard2 = scoreBoard1.addYahtzeeBonus(100)
      
      expect(scoreBoard1).not.toBe(scoreBoard2)
    })
  
    it("6.4) preserves scores when adding bonus", () => {
      const scoreBoard1 = YamsScoreBoard.create()
        .addScore(YamsCategory.Ones, 50)
      const scoreBoard2 = scoreBoard1.addYahtzeeBonus(100)
      
      expect(scoreBoard2.getScore(YamsCategory.Ones)).toBe(50)
      expect(scoreBoard2.getTotalYahtzeeBonus()).toBe(100)
    })
  })
  
  describe("7) getTotalYahtzeeBonus", () => {
    it("7.1) returns 0 by default", () => {
      const scoreBoard = YamsScoreBoard.create()
      expect(scoreBoard.getTotalYahtzeeBonus()).toBe(0)
    })
  })

})