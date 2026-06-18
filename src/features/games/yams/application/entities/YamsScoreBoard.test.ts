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

})