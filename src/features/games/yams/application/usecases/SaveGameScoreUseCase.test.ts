import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SaveGameScoreUseCase } from './SaveGameScoreUseCase'
import type { IScoreRepository, ScoreData } from '../repositories/IScoreRepository'
import type { SaveGameScoreInput } from '../dtos/SaveGameScoreDTO'

vi.stubGlobal('console', {
  error: vi.fn(),
  log: console.log,
  info: console.info,
  warn: console.warn,
})

const mockRepository: IScoreRepository = {
  save: vi.fn(),
}

const fakeInput: SaveGameScoreInput = {
  playerName: 'Alice',
  score: 300,
  yahtzeeBonus: 1,
}

describe('Application unit tests (SaveGameScoreUseCase)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('1) Repository integration', () => {
    it('1.1) Should call repository.save with correct data', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true, id: 'abc123' })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      await useCase.execute(fakeInput)

      const savedData: ScoreData = vi.mocked(mockRepository.save).mock.calls[0][0]

      expect(mockRepository.save).toHaveBeenCalledOnce()
      expect(savedData.playerName).toBe(fakeInput.playerName)
      expect(savedData.score).toBe(fakeInput.score)
      expect(savedData.yahtzeeBonus).toBe(fakeInput.yahtzeeBonus)
      expect(typeof savedData.timestamp).toBe('string')
      expect(savedData.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/)
    })

    it('1.2) Should return success output when repository.save succeeds', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true, id: 'abc123' })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute(fakeInput)

      expect(result.success).toBe(true)
      expect(result.id).toBe('abc123')
    })

    it('1.3) Should return error output when repository.save fails', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: false, error: 'Network error' })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute(fakeInput)

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('1.4) Should generate timestamp at execution time', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const before = new Date().toISOString()
      const useCase = new SaveGameScoreUseCase(mockRepository)
      await useCase.execute(fakeInput)
      const after = new Date().toISOString()

      const savedData: ScoreData = vi.mocked(mockRepository.save).mock.calls[0][0]

      expect(savedData.timestamp >= before).toBe(true)
      expect(savedData.timestamp <= after).toBe(true)
    })
  })

  // ===== NEW =====
  describe('2) Validation - playerName', () => {
    it('2.1) Should reject empty playerName', async () => {
      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        playerName: ''
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('playerNameEmptyError')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('2.2) Should reject playerName with only whitespace', async () => {
      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        playerName: '   '
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('playerNameEmptyError')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('2.3) Should reject playerName exceeding 10 characters', async () => {
      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        playerName: 'VeryLongName'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('playerNameTooLongError')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('2.4) Should accept playerName exactly 10 characters', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      await useCase.execute({
        ...fakeInput,
        playerName: '1234567890'
      })

      expect(mockRepository.save).toHaveBeenCalled()
    })

    it('2.5) Should reject playerName with invalid characters', async () => {
      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        playerName: 'Alice@123'
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('invalidPlayerNameError')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('2.6) Should trim whitespace from playerName', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      await useCase.execute({
        ...fakeInput,
        playerName: '  Alice  '
      })

      const savedData: ScoreData = vi.mocked(mockRepository.save).mock.calls[0][0]
      expect(savedData.playerName).toBe('Alice')
    })

    it('2.7) Should accept accented characters', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        playerName: 'Élise'
      })

      expect(result.success).toBe(true)
      expect(mockRepository.save).toHaveBeenCalled()
    })
  })

  describe('3) Validation - score', () => {
    it('3.1) Should reject negative score', async () => {
      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        score: -10
      })

      expect(result.success).toBe(false)
      expect(result.error).toBe('invalidScoreValueError')
      expect(mockRepository.save).not.toHaveBeenCalled()
    })

    it('3.2) Should accept zero score', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        score: 0
      })

      expect(result.success).toBe(true)
      expect(mockRepository.save).toHaveBeenCalled()
    })

    it('3.3) Should accept positive score', async () => {
      vi.mocked(mockRepository.save).mockResolvedValue({ success: true })

      const useCase = new SaveGameScoreUseCase(mockRepository)
      const result = await useCase.execute({
        ...fakeInput,
        score: 350
      })

      expect(result.success).toBe(true)
      expect(mockRepository.save).toHaveBeenCalled()
    })
  })
  // ===== END NEW =====
})