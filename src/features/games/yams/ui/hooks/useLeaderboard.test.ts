import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useLeaderboard } from './useLeaderboard'
import { GetLeaderboardUseCase } from '../../application/usecases/GetLeaderboardUseCase'
import type { LeaderboardScore } from '../../domain/repositories/ILeaderboardRepository'

vi.mock('../../infrastructure/firebase/repositories/FirebaseLeaderboardRepository')
vi.mock('../../application/usecases/GetLeaderboardUseCase')

const mockUnsubscribe = vi.fn()

const fakeScores: LeaderboardScore[] = [
  { id: 'doc1', rank: 1, playerName: 'Alice', score: 300, timestamp: '15/01/2025' },
  { id: 'doc1', rank: 2, playerName: 'Bob',   score: 250, timestamp: '20/02/2025' },
]

describe('Unit tests - UI hooks', () => {
  describe('useLeaderboard', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('1) Initial state', () => {
      it('1.1) should start with loading=true and empty scores', () => {
        vi.mocked(GetLeaderboardUseCase.prototype.execute).mockReturnValue(mockUnsubscribe)

        const { result } = renderHook(() => useLeaderboard())

        expect(result.current.loading).toBe(true)
        expect(result.current.scores).toEqual([])
      })
    })

    describe('2) Subscription', () => {
      it('2.1) should set scores and loading=false when callback is called', () => {
        vi.mocked(GetLeaderboardUseCase.prototype.execute).mockImplementation(
          (callback: (scores: LeaderboardScore[]) => void) => {
            callback(fakeScores)
            return mockUnsubscribe
          }
        )

        const { result } = renderHook(() => useLeaderboard())

        expect(result.current.loading).toBe(false)
        expect(result.current.scores).toEqual(fakeScores)
      })

      it('2.2) should update scores when callback is called with new data', () => {
        let capturedCallback: ((scores: LeaderboardScore[]) => void) | null = null

        vi.mocked(GetLeaderboardUseCase.prototype.execute).mockImplementation(
          (callback: (scores: LeaderboardScore[]) => void) => {
            capturedCallback = callback
            return mockUnsubscribe
          }
        )

        const { result } = renderHook(() => useLeaderboard())

        act(() => {
          if (capturedCallback) capturedCallback(fakeScores)
        })
      
        expect(result.current.scores).toEqual(fakeScores)
        expect(result.current.loading).toBe(false)
      })
    })

    describe('3) Cleanup', () => {
      it('3.1) should call unsubscribe on unmount', () => {
        vi.mocked(GetLeaderboardUseCase.prototype.execute).mockReturnValue(mockUnsubscribe)

        const { unmount } = renderHook(() => useLeaderboard())

        unmount()

        expect(mockUnsubscribe).toHaveBeenCalledOnce()
      })
    })
  })
})