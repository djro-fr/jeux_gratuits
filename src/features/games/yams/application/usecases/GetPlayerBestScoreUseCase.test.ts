import type { ILeaderboardRepository } from "../../domain/repositories/ILeaderboardRepository"
import { GetPlayerBestScoreUseCase } from "./GetPlayerBestScoreUseCase"

describe('Application unit tests (GetPlayerBestScoreUseCase)', () => {
  const mockRepository: ILeaderboardRepository = {
    getTopScores: vi.fn(),
    subscribe: vi.fn(),
    getPlayerRank: vi.fn(),
    getPlayerBestScore: vi.fn(),
  }

  const useCase = new GetPlayerBestScoreUseCase(mockRepository)

  describe('1) Player has scores', () => {
    it('1.1) should return best score', async () => {
      vi.mocked(mockRepository.getPlayerBestScore).mockResolvedValue(250)

      const result = await useCase.execute({ playerName: 'Alice' })

      expect(result.bestScore).toBe(250)
      expect(result.isNewPlayer).toBe(false)
    })
  })

  describe('2) New player', () => {
    it('2.1) should return null and isNewPlayer true', async () => {
      vi.mocked(mockRepository.getPlayerBestScore).mockResolvedValue(null)

      const result = await useCase.execute({ playerName: 'Bob' })

      expect(result.bestScore).toBeNull()
      expect(result.isNewPlayer).toBe(true)
    })
  })

  describe('3) Multiple scores for same player', () => {
    it('3.1) should return only the highest score', async () => {
      vi.mocked(mockRepository.getPlayerBestScore).mockResolvedValue(300)

      const result = await useCase.execute({ playerName: 'Charlie' })

      expect(result.bestScore).toBe(300)
      expect(typeof result.bestScore).toBe('number') 
    })

    it('3.2) should return best score when player has multiple attempts', async () => {
      
      vi.mocked(mockRepository.getPlayerBestScore).mockResolvedValue(300)

      const result = await useCase.execute({ playerName: 'Diana' })

      expect(result.bestScore).toBe(300) 
    })
  })

  describe('4) Duplicate scores (same value)', () => {
    it('4.1) should return single value, not array', async () => {
      
      vi.mocked(mockRepository.getPlayerBestScore).mockResolvedValue(250)

      const result = await useCase.execute({ playerName: 'Eve' })

      expect(result.bestScore).toBe(250)
      expect(Array.isArray(result.bestScore)).toBe(false)
      
    })
  })

})