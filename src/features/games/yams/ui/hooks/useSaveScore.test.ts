import { renderHook, act } from "@testing-library/react"
import { SaveGameScoreUseCase } from "../../application/usecases/SaveGameScoreUseCase"
import { YamsScoreBoard } from "../../domain/entities/YamsScoreBoard"
import { useSaveScore } from "./useSaveScore"
import type { LeaderboardScore } from "../../domain/repositories/ILeaderboardRepository"
import type { YamsCategory } from "../../domain/rules/calculateScore"

vi.stubGlobal("alert", vi.fn())

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-i18next")>()
  return {
    ...actual,
    useTranslation: () => ({ t: (key: string) => key }),
  }
})

vi.mock("../../infrastructure/firebase/repositories/FirebaseScoreRepository")
vi.mock("../../application/usecases/SaveGameScoreUseCase")

const mockSetError = vi.fn()
const mockSetSuccessMessage = vi.fn()

const fakeLeaderboard: LeaderboardScore[] = [
  {
    id: "doc1",
    rank: 1,
    playerName: "Alice",
    score: 300,
    timestamp: "15/01/2025",
  },
  {
    id: "doc2",
    rank: 2,
    playerName: "Bob",
    score: 250,
    timestamp: "20/02/2025",
  },
]

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
      leaderboardScores: fakeLeaderboard,
      setError: mockSetError,
      setSuccessMessage: mockSetSuccessMessage,
    }),
  )

describe("Unit tests - UI hooks", () => {
  describe("useSaveScore", () => {
    beforeEach(() => {
      vi.clearAllMocks()
      vi.resetAllMocks()
      vi.mocked(SaveGameScoreUseCase.prototype.execute).mockClear()
    })

    describe("1) Initial state", () => {
      it("1.1) should start with empty playerName", () => {
        const { result } = renderUseSaveScore()
        expect(result.current.playerName).toBe("")
      })
    })

    // ===== ADD =====
    describe("2) Save success", () => {
      it("2.1) should reset playerName on success", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

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
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith(null)
      })

      it("2.3) should call setSuccessMessage on success", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetSuccessMessage).toHaveBeenCalledWith("ui.scoreSaved")
      })

      it("2.4) should calculate player rank correctly", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        // buildScoreBoard total: 345
        // fakeLeaderboard: 300, 250
        // Rank = 1 (score > both)
        expect(result.current.playerRank).toBe(1)
      })
    })
    // ===== END ADD =====

    describe("3) Save failure", () => {
      it("3.1) should translate error.name from UseCase", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: false,
          error: "playerNameTooLong",
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.playerNameTooLong")
      })

      it("3.2) should set fallback error if no error message returned", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: false,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.unknownError")
      })
    })

    describe("4) Rate limiting", () => {
      beforeEach(() => {
        vi.clearAllMocks()
        vi.resetAllMocks()
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockClear()
      })
      it("4.1) should prevent saving if called within 5 seconds", async () => {
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(
          vi.mocked(SaveGameScoreUseCase.prototype.execute),
        ).toHaveBeenCalledOnce()

        act(() => {
          result.current.setPlayerName("Bob")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(mockSetError).toHaveBeenCalledWith("errors.rateLimitError")
        expect(
          vi.mocked(SaveGameScoreUseCase.prototype.execute),
        ).toHaveBeenCalledOnce()
      })

      it("4.2) should allow saving after 5 seconds", async () => {
        vi.useFakeTimers()
        vi.mocked(SaveGameScoreUseCase.prototype.execute).mockResolvedValue({
          success: true,
        })

        const { result } = renderUseSaveScore(buildScoreBoard())

        act(() => {
          result.current.setPlayerName("Alice")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(
          vi.mocked(SaveGameScoreUseCase.prototype.execute),
        ).toHaveBeenCalledOnce()

        act(() => {
          vi.advanceTimersByTime(5000)
        })

        act(() => {
          result.current.setPlayerName("Bob")
        })
        await act(async () => {
          await result.current.handleSaveAndRestart()
        })

        expect(
          vi.mocked(SaveGameScoreUseCase.prototype.execute),
        ).toHaveBeenCalledTimes(2)
        vi.useRealTimers()
      })
    })
  })
})
