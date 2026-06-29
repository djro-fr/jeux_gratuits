import { YamsGame } from "../../domain/aggregates/YamsGame"
import { YamsCategory } from "../../domain/rules/calculateScore"
import { KeepDiceUseCase } from "../usecases/KeepDiceUseCase"
import { RollDiceUseCase } from "../usecases/RollDiceUseCase"
import { RecordScoreUseCase } from "../usecases/RecordScoreUseCase"
import { Die } from "../../domain/valueObjects/Die"
import { DiceRoll } from "../../domain/valueObjects/DiceRoll"
import { YamsTurn } from "../../domain/valueObjects/YamsTurn"

describe("Integration: YamsGameFlow - One complete turn", () => {
  it("1) Should complete one turn: roll → score", () => {
    const rollUseCase = new RollDiceUseCase()
    const scoreUseCase = new RecordScoreUseCase()
    
    const game1 = new YamsGame()
    const game2 = rollUseCase.execute({ game: game1 })
    
    expect(game2.getCurrentTurn().getDiceRoll().getDice().length).toBe(5)
    
    const game3 = scoreUseCase.execute({
      game: game2,
      category: YamsCategory.Chance
    })
    
    expect(game3.getScoreBoard().getScore(YamsCategory.Chance)).not.toBeNull()
    expect(game3).not.toBe(game1)
  })

  it("2) Should complete two turns with score accumulation", () => {
    const scoreUseCase = new RecordScoreUseCase()
    
    let game = new YamsGame()
    
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.Ones
    })
    expect(game.getScoreBoard().getScore(YamsCategory.Ones)).not.toBeNull()
    
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.Twos
    })
    expect(game.getScoreBoard().getScore(YamsCategory.Twos)).not.toBeNull()
    expect(game.getGameTurnNumber()).toBe(3)
  })

  it("3) Should complete one turn with keep and reroll", () => {
    const keepUseCase = new KeepDiceUseCase()
    const scoreUseCase = new RecordScoreUseCase()
    
    let game = new YamsGame()
    
    game = keepUseCase.execute({
      game,
      indicesToKeep: [0, 1]
    })
    expect(game.getCurrentTurn().getRollNumber()).toBe(2)
    
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.Chance
    })
    
    expect(game.getScoreBoard().getScore(YamsCategory.Chance)).toBeGreaterThan(0)
  })

  it("4) Should apply Yahtzee bonus on second Yahtzee roll", () => {
    const scoreUseCase = new RecordScoreUseCase()
        
    const yahtzee1Dice = [
      new Die(5), new Die(5), new Die(5), new Die(5), new Die(5)
    ]
    const yahtzeeRoll = new DiceRoll(yahtzee1Dice)
    const yahtyeeTurn = new YamsTurn(1, yahtzeeRoll)
    let game = new YamsGame(undefined, yahtyeeTurn)
    
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.Yahtzee
    })
    
    expect(game.getScoreBoard().getScore(YamsCategory.Yahtzee)).toBe(50)
    expect(game.getScoreBoard().getTotalYahtzeeBonus()).toBe(0)
        
    const yahtzee2Dice = [
      new Die(3), new Die(3), new Die(3), new Die(3), new Die(3)
    ]
    const yahtzeeRoll2 = new DiceRoll(yahtzee2Dice)
    const yahtyeeTurn2 = new YamsTurn(1, yahtzeeRoll2)
    game = new YamsGame(game.getScoreBoard(), yahtyeeTurn2)
    
    game = scoreUseCase.execute({
      game,
      category: YamsCategory.FourOfAKind
    })
        
    expect(game.getScoreBoard().getTotalYahtzeeBonus()).toBe(100)
  })
})