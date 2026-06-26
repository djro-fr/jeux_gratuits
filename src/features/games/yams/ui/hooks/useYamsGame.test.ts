import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useYamsGame } from './useYamsGame'
import { RollDiceUseCase } from '../../application/usecases/RollDiceUseCase'
import { KeepDiceUseCase } from '../../application/usecases/KeepDiceUseCase'
import { ScoreTurnUseCase } from '../../application/usecases/ScoreTurnUseCase'
import { YamsCategory } from '../../domain/rules/calculateScore'
import { YamsScoreBoard } from '../../domain/entities/YamsScoreBoard'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

vi.mock('../../application/usecases/RollDiceUseCase')
vi.mock('../../application/usecases/KeepDiceUseCase')
vi.mock('../../application/usecases/ScoreTurnUseCase')

const mockDiceRoll = {
  getDice: vi.fn().mockReturnValue([]),
}

const mockTurn = {
  getRollNumber: vi.fn().mockReturnValue(1),
  getDiceRoll: vi.fn().mockReturnValue(mockDiceRoll),
  canRoll: vi.fn().mockReturnValue(true),
}

const mockTurnRoll3 = {
  getRollNumber: vi.fn().mockReturnValue(3),
  getDiceRoll: vi.fn().mockReturnValue(mockDiceRoll),
  canRoll: vi.fn().mockReturnValue(false),
}

describe('Unit tests - UI hooks', () => {
  describe('useYamsGame', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('1) Initial state', () => {
      it('1.1) should start with null diceRoll, yamsTurn and empty selections', () => {
        const { result } = renderHook(() => useYamsGame())

        expect(result.current.diceRoll).toBeNull()
        expect(result.current.yamsTurn).toBeNull()
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

    describe('2) handleRoll', () => {
      it('2.1) should set yamsTurn and diceRoll after rolling', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })

        expect(result.current.diceRoll).toBe(mockDiceRoll)
        expect(result.current.yamsTurn).not.toBeNull()
      })

      it('2.2) should reset selectedIndices after rolling', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.setSelectedIndices([1, 2]) })
        act(() => { result.current.handleRoll() })

        expect(result.current.selectedIndices).toEqual([])
      })

      it('2.3) should not roll if yamsTurn is already set', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.handleRoll() })

        expect(RollDiceUseCase.prototype.execute).toHaveBeenCalledOnce()
      })

      it('2.4) should set error if RollDiceUseCase throws', () => {
        const error = new Error('WrongNumberOfDice')
        error.name = 'WrongNumberOfDice'
        vi.mocked(RollDiceUseCase.prototype.execute).mockImplementation(() => { throw error })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })

        expect(result.current.error).toBe('errors.WrongNumberOfDice')
      })
    })

    describe('3) handleKeepDice', () => {
      it('3.1) should update yamsTurn and diceRoll after keeping dice', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)
        vi.mocked(KeepDiceUseCase.prototype.execute).mockReturnValue(mockTurn as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.handleKeepDice([0, 1]) })

        expect(result.current.yamsTurn).toBe(mockTurn)
        expect(result.current.diceRoll).toBe(mockDiceRoll)
      })

      it('3.2) should reset selectedIndices when rollNumber reaches 3', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)
        vi.mocked(KeepDiceUseCase.prototype.execute).mockReturnValue(mockTurnRoll3 as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.setSelectedIndices([0, 2]) })
        act(() => { result.current.handleKeepDice([1, 3]) })

        expect(result.current.selectedIndices).toEqual([])
      })

      it('3.3) should set error if KeepDiceUseCase throws', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)
        const error = new Error('TooManyDiceKeptError')
        error.name = 'TooManyDiceKeptError'
        vi.mocked(KeepDiceUseCase.prototype.execute).mockImplementation(() => { throw error })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.handleKeepDice([0, 1, 2, 3, 4]) })

        expect(result.current.error).toBe('errors.TooManyDiceKeptError')
      })

      it('3.4) should do nothing if yamsTurn is null', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleKeepDice([0]) })

        expect(KeepDiceUseCase.prototype.execute).not.toHaveBeenCalled()
      })
    })

    describe('4) handleScore', () => {
      it('4.1) should reset turn state after scoring', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)
        vi.mocked(ScoreTurnUseCase.prototype.execute).mockReturnValue({
          updatedScoreBoard: YamsScoreBoard.create().addScore(YamsCategory.Ones, 5),
          scoreEarned: 5,
        })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(result.current.diceRoll).toBeNull()
        expect(result.current.yamsTurn).toBeNull()
        expect(result.current.selectedCategory).toBeNull()
        expect(result.current.selectedIndices).toEqual([])
        expect(result.current.showScoreBoard).toBe(false)
        expect(result.current.error).toBeNull()
      })

      it('4.2) should set error if ScoreTurnUseCase throws categoryAlreadyScoredError', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)
        const error = new Error('categoryAlreadyScoredError')
        error.name = 'categoryAlreadyScoredError'
        vi.mocked(ScoreTurnUseCase.prototype.execute).mockImplementation(() => { throw error })

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(result.current.error).toBe('errors.categoryAlreadyScoredError')
      })

      it('4.3) should do nothing if diceRoll is null', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleScore(YamsCategory.Ones) })

        expect(ScoreTurnUseCase.prototype.execute).not.toHaveBeenCalled()
      })
    })

    describe('5) handleRestart', () => {
      it('5.1) should reset all state to initial values', () => {
        vi.mocked(RollDiceUseCase.prototype.execute).mockReturnValue(mockDiceRoll as never)

        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleRoll() })
        act(() => { result.current.setSelectedIndices([1, 2]) })
        act(() => { result.current.setError('some error') })
        act(() => { result.current.handleRestart() })

        expect(result.current.diceRoll).toBeNull()
        expect(result.current.yamsTurn).toBeNull()
        expect(result.current.selectedIndices).toEqual([])
        expect(result.current.selectedCategory).toBeNull()
        expect(result.current.error).toBeNull()
        expect(result.current.showScoreBoard).toBe(false)
      })

      it('5.2) should reset scoreBoard to a fresh one', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleFillTestData() })
        act(() => { result.current.handleRestart() })

        const scores = result.current.scoreBoard.getAllScores()
        const allNull = Object.values(scores).every((s) => s === null)
        expect(allNull).toBe(true)
      })
    })

    describe('6) handleFillTestData', () => {
      it('6.1) should fill all categories with scores', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleFillTestData() })

        const scores = result.current.scoreBoard.getAllScores()
        const allScored = Object.values(scores).every((s) => s !== null)
        expect(allScored).toBe(true)
      })

      it('6.2) should reset turn and error', () => {
        const { result } = renderHook(() => useYamsGame())

        act(() => { result.current.handleFillTestData() })

        expect(result.current.yamsTurn).toBeNull()
        expect(result.current.diceRoll).toBeNull()
        expect(result.current.error).toBeNull()
      })
    })
  })
})