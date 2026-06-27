import { InvalidPlayerNameError, InvalidScoreValueError, PlayerNameEmptyError, PlayerNameTooLongError } from "../errors/YamsErrors"
import type { SaveGameScoreInput, SaveGameScoreOutput } from "../dtos/SaveGameScoreDTO"

import type { IScoreRepository, ScoreData } from "../repositories/IScoreRepository"

export class SaveGameScoreUseCase {
  readonly repository: IScoreRepository
  
  constructor(repository: IScoreRepository) {
    this.repository = repository
  }

  private isValidPlayerName(name: string): boolean {
    const regex = /^[a-zA-Z0-9\s\-'éèêëàâäùûüôöçÉÈÊËÀÂÄÙÛÜÔÖÇ]+$/
    return regex.test(name)
  }

  async execute(input: SaveGameScoreInput): Promise<SaveGameScoreOutput> {
    try {
      const playerName = input.playerName.trim()
      
      if (playerName.length === 0) {
        throw new PlayerNameEmptyError({
          received: ''
        })
      }
      if (playerName.length > 10) {
        throw new PlayerNameTooLongError({ 
          maxLength: 10, 
          actualLength: playerName.length 
        })
      }
      if (!this.isValidPlayerName(playerName)) {        
        throw new InvalidPlayerNameError({
          playerName,
          reason: 'Contains invalid characters'
        })
      }
      if (input.score < 0) {
        throw new InvalidScoreValueError({ score: input.score })
      }

      const data: ScoreData = {
        playerName,
        score: input.score,
        yahtzeeBonus: input.yahtzeeBonus,
        timestamp: new Date().toISOString()
      }
      return this.repository.save(data)
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'unknownError'      
      console.error(errorName, error instanceof Error ? error.message : error)
      return { success: false, error: errorName }
    }
  }
}