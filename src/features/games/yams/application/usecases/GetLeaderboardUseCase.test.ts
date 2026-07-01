import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GetLeaderboardUseCase } from './GetLeaderboardUseCase'
import type { ILeaderboardRepository, LeaderboardScore } from '../../domain/repositories/ILeaderboardRepository'

const mockUnsubscribe = vi.fn()

const mockRepository: ILeaderboardRepository = {
  subscribe: vi.fn(),
  getTopScores: vi.fn(),
  getPlayerRank: vi.fn(),
}

const fakeScores: LeaderboardScore[] = [
  { id: 'doc1', rank: 1, playerName: 'Alice', score: 300, timestamp: '2025-01-01T10:00:00Z' },
  { id: 'doc1', rank: 2, playerName: 'Bob',   score: 250, timestamp: '2025-01-02T10:00:00Z' },
]

describe('Application unit tests (GetLeaderboardUseCase)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('1) Should pass the callback to the repository', () => {
    vi.mocked(mockRepository.subscribe).mockReturnValue(mockUnsubscribe)

    const useCase = new GetLeaderboardUseCase(mockRepository)
    const callback = vi.fn()

    useCase.execute(callback)

    expect(mockRepository.subscribe).toHaveBeenCalledOnce()
    expect(mockRepository.subscribe).toHaveBeenCalledWith(callback)
  })

  it('2) Should return the unsubscribe function provided by the repository', () => {
    vi.mocked(mockRepository.subscribe).mockReturnValue(mockUnsubscribe)

    const useCase = new GetLeaderboardUseCase(mockRepository)
    const result = useCase.execute(vi.fn())

    expect(result).toBe(mockUnsubscribe)
  })

  it('3) Should forward scores to the callback via the repository', () => {
    vi.mocked(mockRepository.subscribe).mockImplementation(
      (cb: (scores: LeaderboardScore[]) => void) => {
        cb(fakeScores)
        return mockUnsubscribe
      }
    )

    const useCase = new GetLeaderboardUseCase(mockRepository)
    const callback = vi.fn()

    useCase.execute(callback)

    expect(callback).toHaveBeenCalledOnce()
    expect(callback).toHaveBeenCalledWith(fakeScores)
  })

  it('4) Should allow calling the returned unsubscribe function', () => {
    vi.mocked(mockRepository.subscribe).mockReturnValue(mockUnsubscribe)

    const useCase = new GetLeaderboardUseCase(mockRepository)
    const unsubscribe = useCase.execute(vi.fn())

    unsubscribe()

    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })
})