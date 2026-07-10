import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getDocs, onSnapshot, where, orderBy, limit, type QuerySnapshot } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { FirebaseLeaderboardRepository } from './FirebaseLeaderboardRepository'
import { LeaderboardFetchError } from '../../errors/YamsErrors'

vi.mock('firebase/firestore')

type MockDoc = {
  id: string
  data: () => Record<string, unknown>
}

type MockQuerySnapshot = Omit<QuerySnapshot<DocumentData>, 'forEach'> & {
  size: number
  empty: boolean
  docs: MockDoc[]
  forEach: (callback: (doc: MockDoc) => void) => void
}

const createMockQuerySnapshot = (empty: boolean, docs: MockDoc[] = []): MockQuerySnapshot =>
  ({
    empty,
    size: docs.length,
    docs,
    forEach: vi.fn()
  } as unknown as MockQuerySnapshot)

describe('Infrastructure unit tests (FirebaseLeaderboardRepository)', () => {
  let repository: FirebaseLeaderboardRepository

  beforeEach(() => {
    repository = new FirebaseLeaderboardRepository()
    vi.clearAllMocks()
  })

  describe('1) getTopScores', () => {
    it('1.1) should return top scores ordered by score descending', async () => {
      const mockDocs: MockDoc[] = [
        {
          id: 'doc-1',
          data: () => ({
            playerName: 'Alice',
            score: 350,
            yahtzeeBonus: 100,
            createdAt: new Date('2024-01-01')
          })
        },
        {
          id: 'doc-2',
          data: () => ({
            playerName: 'Bob',
            score: 300,
            yahtzeeBonus: 0,
            createdAt: new Date('2024-01-02')
          })
        }
      ]

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, mockDocs) as unknown as QuerySnapshot<DocumentData>)

      const result = await repository.getTopScores(10)

      expect(result).toHaveLength(2)
      expect(result[0].score).toBe(350)
      expect(result[1].score).toBe(300)
    })

    it('1.2) should return empty array when no scores exist', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      const result = await repository.getTopScores(10)

      expect(result).toEqual([])
    })

    it('1.3) should throw LeaderboardFetchError on database failure', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'))

      await expect(repository.getTopScores(10)).rejects.toThrow(LeaderboardFetchError)
    })
  })

  describe('2) getPlayerRank', () => {
    it('2.1) should calculate correct rank based on scores above', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, [
        { id: 'doc-1', data: () => ({ score: 400 }) },
        { id: 'doc-2', data: () => ({ score: 380 }) }
      ]) as unknown as QuerySnapshot<DocumentData>)

      const rank = await repository.getPlayerRank(350)

      expect(rank).toBe(3)
    })

    it('2.2) should return rank 1 when player has highest score', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      const rank = await repository.getPlayerRank(500)

      expect(rank).toBe(1)
    })

    it('2.3) should throw LeaderboardFetchError on database failure', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'))

      await expect(repository.getPlayerRank(300)).rejects.toThrow(LeaderboardFetchError)
    })
  })

  describe('3) getPlayerBestScore', () => {
    it('3.1) should return best score for existing player', async () => {
      const mockDocs: MockDoc[] = [
        {
          id: 'doc-1',
          data: () => ({
            playerName: 'Charlie',
            score: 280,
            yahtzeeBonus: 50
          })
        }
      ]

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, mockDocs) as unknown as QuerySnapshot<DocumentData>)

      const score = await repository.getPlayerBestScore('Charlie')

      expect(score).toBe(280)
    })

    it('3.2) should return null for new player', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      const score = await repository.getPlayerBestScore('UnknownPlayer')

      expect(score).toBeNull()
    })

    it('3.3) should return only the best (first) score', async () => {
      const mockDocs: MockDoc[] = [
        {
          id: 'doc-1',
          data: () => ({ playerName: 'Diana', score: 300 })
        }
      ]

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, mockDocs) as unknown as QuerySnapshot<DocumentData>)

      const score = await repository.getPlayerBestScore('Diana')

      expect(score).toBe(300)
      expect(typeof score).toBe('number')
    })

    it('3.4) should throw LeaderboardFetchError on database failure', async () => {
      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'))

      await expect(repository.getPlayerBestScore('Eve')).rejects.toThrow(LeaderboardFetchError)
    })
  })

  describe('4) subscribe', () => {
    it('4.1) should call onSnapshot to listen to real-time updates', () => {
      const mockCallback = vi.fn()
      vi.mocked(onSnapshot).mockReturnValue(vi.fn())

      repository.subscribe(mockCallback)

      expect(onSnapshot).toHaveBeenCalled()
    })

    it('4.2) should return unsubscribe function', () => {
      const mockUnsubscribe = vi.fn()
      vi.mocked(onSnapshot).mockReturnValue(mockUnsubscribe)

      const unsubscribe = repository.subscribe(() => {})

      expect(unsubscribe).toBe(mockUnsubscribe)
    })
  })

  describe('5) Query correctness', () => {
    it('5.1) getTopScores should order by score descending', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      await repository.getTopScores(20)

      expect(orderBy).toHaveBeenCalledWith('score', 'desc')
      expect(limit).toHaveBeenCalledWith(20)
    })

    it('5.2) getPlayerBestScore should query by playerName', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      await repository.getPlayerBestScore('Grace')

      expect(where).toHaveBeenCalledWith('playerName', '==', 'Grace')
    })

    it('5.3) getPlayerRank should query scores greater than player score', async () => {
      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []) as unknown as QuerySnapshot<DocumentData>)

      await repository.getPlayerRank(250)

      expect(where).toHaveBeenCalledWith('score', '>', 250)
    })
  })
})