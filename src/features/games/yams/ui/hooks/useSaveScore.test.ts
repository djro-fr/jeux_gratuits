import { renderHook, act } from "@testing-library/react"
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { FirebaseLeaderboardRepository } from "../../infrastructure/firebase/repositories/FirebaseLeaderboardRepository"
import { GetPlayerBestScoreUseCase } from "../../application/usecases/GetPlayerBestScoreUseCase"
import { YamsScoreBoard } from "../../domain/valueObjects/YamsScoreBoard"
import { useSaveScore } from "./useSaveScore"
import type { YamsCategory } from "../../domain/rules/calculateScore"


class NetworkError extends Error {
  name = 'networkError'
}

class FirestoreError extends Error {
  name = 'firestoreError'  
}

vi.stubGlobal("alert", vi.fn())

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
  }
})

vi.mock("../../infrastructure/firebase/repositories/FirebaseScoreRepository")
vi.mock("../../infrastructure/firebase/repositories/FirebaseLeaderboardRepository")
vi.mock("../../application/usecases/SaveGameScoreUseCase")
vi.mock("../../application/usecases/GetPlayerBestScoreUseCase")

const mockSetError = vi.fn()

const buildScoreBoard = () => {
  let board = YamsScoreBoard.create()
  const scores: Record<YamsCategory, number> = {
    ones: 5,
    twos: 10,
    threes: 15,
    fours: 20,
    fives: 25,
    sixes: 30,
    chance: 25,
    threeOfAKind: 20,
    fourOfAKind: 25,
    fullHouse: 25,
    smallStraight: 30,
    largeStraight: 40,
    yahtzee: 50,
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
      setError: mockSetError,
    }),
  )

const mockGetPlayerBestScore = (bestScore: number | null, isNewPlayer: boolean) => {
  vi.mocked(GetPlayerBestScoreUseCase.prototype.execute).mockClear()
  vi.mocked(GetPlayerBestScoreUseCase.prototype.execute).mockResolvedValue({
    bestScore,
    isNewPlayer,
    canSave: bestScore === null,
  })
}

const mockSaveSuccess = () => {
  vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
    success: true,
  })
}

const mockSaveFailure = (error: string | undefined = undefined) => {
  vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
    success: false,
    error,
  })
}

describe("Unit tests - UI hooks", () => {
  describe("useSaveScore", () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetAllMocks()
      mockGetPlayerBestScore(null, true)
      mockSaveSuccess()
    })

    describe("1) Initial state", () => {
      it("1.1) should start with empty playerName", () => {
        const { result } = renderUseSaveScore()
        expect(result.current.playerName).toBe("")
      })

      it("1.2) should start with null message", () => {
        const { result } = renderUseSaveScore()
        expect(result.current.message).toBeNull()
      })

      it("1.3) should start with null playerRank", () => {
        const { result } = renderUseSaveScore()
        expect(result.current.playerRank).toBeNull()
      })
    })

    describe("2) Save success", () => {
      it("2.1) should reset playerName on success", async () => {
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(result.current.playerName).toBe("")
      })

      it("2.2) should clear error before saving", async () => {
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith(null)
      })

      it("2.3) should set success message on success", async () => {
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(result.current.message).toEqual({
          text: 'ui.scoreSaved',
          type: 'success'
        })
      })

      it("2.4) should fetch player rank from repository", async () => {
        vi.mocked(FirebaseLeaderboardRepository.prototype.getPlayerRank).mockResolvedValue(3)
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(vi.mocked(FirebaseLeaderboardRepository.prototype.getPlayerRank)).toHaveBeenCalled()
        expect(result.current.playerRank).toBe(3)
      })

      it("2.5) should handle rank fetch error", async () => {
        vi.mocked(FirebaseLeaderboardRepository.prototype.getPlayerRank).mockRejectedValue(
          new NetworkError("Failed to fetch rank")
        )
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.networkError")
      })
    })

    describe("3) Validation - Score not better", () => {
      it("3.1) should show validation message if score not better", async () => {
        mockGetPlayerBestScore(400, false)
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(result.current.message).toEqual({
          text: 'ui.scoreValidation.notBetter',
          type: 'validation'
        })
        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).not.toHaveBeenCalled()
      })

      it("3.2) should not save when score equals best score", async () => {
        mockGetPlayerBestScore(370, false)
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(result.current.message?.type).toBe('validation')
        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).not.toHaveBeenCalled()
      })
    })

    describe("4) Save failure", () => {
      it("4.1) should translate error from UseCase", async () => {
        mockSaveFailure("playerNameTooLong")
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.playerNameTooLong")
      })

      it("4.2) should set fallback error if no error message returned", async () => {
        mockSaveFailure()
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.unknownError")
      })

      it("4.3) should handle best score fetch error", async () => {
        vi.mocked(GetPlayerBestScoreUseCase.prototype.execute).mockRejectedValue(
          new FirestoreError("Firestore fetch failed")
        )
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.firestoreError")
        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).not.toHaveBeenCalled()
      })
    })

    describe("5) Rate limiting", () => {
      it("5.1) should prevent saving if called within 5 seconds", async () => {
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).toHaveBeenCalledOnce()

        act(() => {
          result.current.setPlayerName("Bob")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.rateLimitError")
        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).toHaveBeenCalledOnce()
      })

      it("5.2) should allow saving after 5 seconds", async () => {
        vi.useFakeTimers()
        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).toHaveBeenCalledOnce()

        act(() => {
          vi.advanceTimersByTime(5000)
        })

        act(() => {
          result.current.setPlayerName("Bob")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(vi.mocked(SaveGameScoreUseCase.prototype.execute)).toHaveBeenCalledTimes(2)
        vi.useRealTimers()
      })
    })

    describe("6) Message clearing", () => {
      it("6.1) should clear message on handleClearMessage", () => {
        const { result } = renderUseSaveScore()

        act(() => {
          result.current.clearMessage()
        })

        expect(result.current.message).toBeNull()
      })
    })
  })
})