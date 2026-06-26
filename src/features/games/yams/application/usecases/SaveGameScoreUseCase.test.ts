import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SaveGameScoreUseCase } from './SaveGameScoreUseCase'
import type { IScoreRepository, ScoreData } from '../repositories/IScoreRepository'
import type { SaveGameScoreInput } from '../dtos/SaveGameScoreDTO'

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

  it('1) Should call repository.save with the correct data', async () => {
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

  it('2) Should return success output when repository.save succeeds', async () => {
    vi.mocked(mockRepository.save).mockResolvedValue({ success: true, id: 'abc123' })

    const useCase = new SaveGameScoreUseCase(mockRepository)
    const result = await useCase.execute(fakeInput)

    expect(result.success).toBe(true)
    expect(result.id).toBe('abc123')
  })

  it('3) Should return error output when repository.save fails', async () => {
    vi.mocked(mockRepository.save).mockResolvedValue({ success: false, error: 'Network error' })

    const useCase = new SaveGameScoreUseCase(mockRepository)
    const result = await useCase.execute(fakeInput)

    expect(result.success).toBe(false)
    expect(result.error).toBe('Network error')
  })

  it('4) Should generate a timestamp at execution time', async () => {
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