import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSaveScore } from './useSaveScore'
import { SaveGameScoreUseCase } from '../../application/usecases/SaveGameScoreUseCase'
import { YamsScoreBoard } from '../../domain/entities/YamsScoreBoard'
import { YamsCategory } from '../../domain/rules/calculateScore'

vi.stubGlobal('alert', vi.fn())

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>()
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
  }
})

vi.mock('../../infrastructure/firebase/repositories/FirebaseScoreRepository')
vi.mock('../../application/usecases/SaveGameScoreUseCase')

const mockSetError = vi.fn()
const mockOnSuccess = vi.fn()
const mockSetSuccessMessage = vi.fn()

const buildScoreBoard = () => {
  let board = YamsScoreBoard.create()
  const scores: Record<YamsCategory, number> = {
    ones: 5, twos: 10, threes: 15, fours: 20,
    fives: 25, sixes: 30, chance: 25, threeOfAKind: 20,
    fourOfAKind: 25, fullHouse: 25, smallStraight: 30,
    largeStraight: 40, yahtzee: 50
  }
  Object.entries(scores).forEach(([category, score]) => {
    board = board.addScore(category as YamsCategory, score)
  })
  return board
}

const renderUseSaveScore = (scoreBoard = YamsScoreBoard.create()) =>
  renderHook(() =>
    useSaveScore({ 
      scoreBoard, 
      onSuccess: mockOnSuccess, 
      setError: mockSetError,
      setSuccessMessage: mockSetSuccessMessage 
    })
  )

describe('Unit tests - UI hooks', () => {
  describe('useSaveScore', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('1) Initial state', () => {
      it('1.1) should start with empty playerName', () => {
        const { result } = renderUseSaveScore()

        expect(result.current.playerName).toBe('')
      })
    })

    describe('2) Save success', () => {  
      it('2.1) should call onSuccess and reset playerName on success', async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({ success: true })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => { result.current.setPlayerName('Alice') })
        await act(async () => { await result.current.handleSaveAndRestart() })

        expect(mockOnSuccess).toHaveBeenCalledOnce()
        expect(result.current.playerName).toBe('')
      })

      it('2.2) should clear error before saving', async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({ success: true })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => { result.current.setPlayerName('Alice') })
        await act(async () => { await result.current.handleSaveAndRestart() })

        expect(mockSetError).toHaveBeenCalledWith(null)
      })

      it('2.3) should call setSuccessMessage on success', async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({ success: true })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => { result.current.setPlayerName('Alice') })
        await act(async () => { await result.current.handleSaveAndRestart() })

        expect(mockSetSuccessMessage).toHaveBeenCalledWith('ui.scoreSaved')
      })
    })

    describe('3) Save failure', () => {  
      it('3.1) should translate error.name from UseCase', async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: false,
          error: 'playerNameTooLong',  
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => { result.current.setPlayerName('Alice') })
        await act(async () => { await result.current.handleSaveAndRestart() })

        expect(mockSetError).toHaveBeenCalledWith('errors.playerNameTooLong')  
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })

      it('3.2) should set fallback error if no error message returned', async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({ success: false })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => { result.current.setPlayerName('Alice') })
        await act(async () => { await result.current.handleSaveAndRestart() })

        expect(mockSetError).toHaveBeenCalledWith('errors.unknownError')
        expect(mockOnSuccess).not.toHaveBeenCalled()
      })
    })
  })
})