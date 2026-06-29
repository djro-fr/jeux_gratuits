import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useYamsGame } from './useYamsGame'
import { KeepDiceUseCase } from '../../application/usecases/KeepDiceUseCase'
import { RecordScoreUseCase } from '../../application/usecases/RecordScoreUseCase'
import { YamsCategory } from '../../domain/rules/calculateScore'
import { YamsGame } from '../../domain/aggregates/YamsGame'
import { YamsTurn } from '../../domain/valueObjects/YamsTurn'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../../application/usecases/KeepDiceUseCase')
vi.mock('../../application/usecases/RecordScoreUseCase')

describe('Unit tests - UI hooks', () => {
  describe('useYamsGame', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('1) Initial state', () => {
      it('1.1) should start with fresh game state', () => {
        const { result } = renderHook(() => useYamsGame())

        expect(result.current.yamsTurn).not.toBeNull()
        expect(result.current.yamsTurn.getRollNumber()).toBe(1)
        expect(result.current.diceRoll).not.toBeNull()
        expect(result.current.selectedIndices).toEqual([])
        expect(result.current.selectedCategory).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.showScoreBoard).toBe(false)
      })

      it('1.2) should start with a fresh scoreBoard', () => {
        const { result } = renderHook(() => useYamsGame())

        const scores = result.current.scoreBoard.getAllScores()
        const allNull = Object.values(scores).every((s) => s === null)
        expect(allNull).toBe(true)
      })
    })

    describe('2) handleKeepDice', () => {
      it('2.1) should call KeepDiceUseCase with game and indicesToKeep', () => {
        const mockGame = new YamsGame()
        vi.mocked(KeepDiceUseCase.prototype.execute).mockReturnValue(mockGame)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleKeepDice([0, 1]) })

        expect(KeepDiceUseCase.prototype.execute).toHaveBeenCalledWith({
          game: expect.any(YamsGame),
          indicesToKeep: [0, 1]
        })
      })

      it('2.2) should reset selectedIndices when rollNumber reaches 3', () => {
        const turn3 = new YamsTurn(3)
        const gameWithRoll3 = new YamsGame(undefined, turn3)
        
        vi.mocked(KeepDiceUseCase.prototype.execute).mockReturnValue(gameWithRoll3)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.setSelectedIndices([0, 2]) })
        act(() => { result.current.handleKeepDice([1, 3]) })

        expect(result.current.selectedIndices).toEqual([])
      })

      it('2.3) should set error if KeepDiceUseCase throws', () => {
        const error = new Error('TooManyDiceKeptError')
        error.name = 'TooManyDiceKeptError'
        vi.mocked(KeepDiceUseCase.prototype.execute).mockImplementation(() => { throw error })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleKeepDice([0, 1, 2, 3, 4]) })

        expect(result.current.error).toBe('errors.TooManyDiceKeptError')
      })
    })

    describe('3) handleScore', () => {
      it('3.1) should call RecordScoreUseCase with game and category', () => {
        const mockGame = new YamsGame()
        const gameAfterScore = new YamsGame(mockGame.getScoreBoard().addScore(YamsCategory.Ones, 5))
        
        vi.mocked(RecordScoreUseCase.prototype.execute).mockReturnValue(gameAfterScore)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(RecordScoreUseCase.prototype.execute).toHaveBeenCalledWith({
          game: expect.any(YamsGame),
          category: YamsCategory.Ones
        })
      })

      it('3.2) should reset state after scoring', () => {
        const mockGame = new YamsGame()
        const gameAfterScore = new YamsGame(mockGame.getScoreBoard().addScore(YamsCategory.Ones, 5))
        
        vi.mocked(RecordScoreUseCase.prototype.execute).mockReturnValue(gameAfterScore)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(result.current.selectedCategory).toBeNull()
        expect(result.current.selectedIndices).toEqual([])
        expect(result.current.showScoreBoard).toBe(false)
        expect(result.current.error).toBeNull()
      })

      it('3.3) should set error if RecordScoreUseCase throws', () => {
        const error = new Error('CategoryAlreadyScoredError')
        error.name = 'CategoryAlreadyScoredError'
        vi.mocked(RecordScoreUseCase.prototype.execute).mockImplementation(() => { throw error })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(result.current.error).toBe('errors.CategoryAlreadyScoredError')
      })
    })

    describe('4) handleRestart', () => {
      it('4.1) should reset all state to initial values', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.setSelectedIndices([1, 2]) })
        act(() => { result.current.setError('some error') })
        act(() => { result.current.handleRestart() })

        expect(result.current.selectedIndices).toEqual([])
        expect(result.current.selectedCategory).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.showScoreBoard).toBe(false)
        expect(result.current.yamsTurn.getRollNumber()).toBe(1)
      })

      it('4.2) should reset scoreBoard to a fresh one', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleFillTestData() })
        act(() => { result.current.handleRestart() })

        const scores = result.current.scoreBoard.getAllScores()
        const allNull = Object.values(scores).every((s) => s === null)
        expect(allNull).toBe(true)
      })
    })

    describe('5) handleFillTestData', () => {
      it('5.1) should fill all categories with scores', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleFillTestData() })

        const scores = result.current.scoreBoard.getAllScores()
        const allScored = Object.values(scores).every((s) => s !== null)
        expect(allScored).toBe(true)
      })

      it('5.2) should reset error', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.setError('some error') })
        act(() => { result.current.handleFillTestData() })

        expect(result.current.error).toBeNull()
      })
    })
  })
})