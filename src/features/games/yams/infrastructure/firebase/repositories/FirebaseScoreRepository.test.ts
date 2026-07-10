import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addDoc, query, where, getDocs, updateDoc, type QuerySnapshot, type DocumentReference } from 'firebase/firestore'
import type { DocumentData } from 'firebase/firestore'
import { FirebaseScoreRepository } from './FirebaseScoreRepository'
import type { ScoreData } from '../../../domain/repositories/IScoreRepository'
import { SaveScoreError } from '../../errors/YamsErrors'

vi.mock('firebase/firestore')

type MockDoc = {
  id: string
  data: () => Record<string, unknown>
  ref: unknown
}

const createMockQuerySnapshot = (empty: boolean, docs: MockDoc[] = []) => ({
  empty,
  size: docs.length,
  docs,
  forEach: vi.fn()
} as unknown as QuerySnapshot<DocumentData>)

const createMockDocReference = (id: string) => ({
  id,
  withConverter: vi.fn()
} as unknown as DocumentReference<DocumentData>)

describe('Infrastructure unit tests (FirebaseScoreRepository)', () => {
  let repository: FirebaseScoreRepository

  beforeEach(() => {
    repository = new FirebaseScoreRepository()
    vi.clearAllMocks()
  })

  describe('1) New player', () => {
    it('1.1) should create new document when player does not exist', async () => {
      const scoreData: ScoreData = {
        playerName: 'Alice',
        score: 250,
        yahtzeeBonus: 0,
        timestamp: new Date().toISOString()
      }

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []))

      vi.mocked(addDoc).mockResolvedValue(createMockDocReference('doc-1'))

      const result = await repository.save(scoreData)

      expect(result.success).toBe(true)
      expect(result.id).toBe('doc-1')
      expect(addDoc).toHaveBeenCalled()
      expect(updateDoc).not.toHaveBeenCalled()
    })
  })

  describe('2) Player exists - higher score', () => {
    it('2.1) should update document when new score is better', async () => {
      const scoreData: ScoreData = {
        playerName: 'Bob',
        score: 300,
        yahtzeeBonus: 100,
        timestamp: new Date().toISOString()
      }

      const mockRef = { ref: 'existing-ref' }
      const mockDoc = {
        id: 'doc-2',
        data: () => ({
          score: 200, 
          playerName: 'Bob'
        }),
        ref: mockRef
      }

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, [mockDoc]))

      vi.mocked(updateDoc).mockResolvedValue(undefined)

      const result = await repository.save(scoreData)

      expect(result.success).toBe(true)
      expect(result.id).toBe('doc-2')
      expect(updateDoc).toHaveBeenCalledWith(mockRef, expect.objectContaining({
        score: 300,
        yahtzeeBonus: 100
      }))
      expect(addDoc).not.toHaveBeenCalled()
    })
  })

  describe('3) Player exists - lower or equal score', () => {
    it('3.1) should not update when new score is worse', async () => {
      const scoreData: ScoreData = {
        playerName: 'Charlie',
        score: 150,
        yahtzeeBonus: 0,
        timestamp: new Date().toISOString()
      }

      const mockRef = { ref: 'existing-ref' }
      const mockDoc = {
        id: 'doc-3',
        data: () => ({
          score: 200,
          playerName: 'Charlie'
        }),
        ref: mockRef
      }

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, [mockDoc]))

      const result = await repository.save(scoreData)

      expect(result.success).toBe(true)
      expect(updateDoc).not.toHaveBeenCalled()
      expect(addDoc).not.toHaveBeenCalled()
    })

    it('3.2) should not update when new score equals existing score', async () => {
      const scoreData: ScoreData = {
        playerName: 'Diana',
        score: 250,
        yahtzeeBonus: 0,
        timestamp: new Date().toISOString()
      }

      const mockRef = { ref: 'existing-ref' }
      const mockDoc = {
        id: 'doc-4',
        data: () => ({
          score: 250, 
          playerName: 'Diana'
        }),
        ref: mockRef
      }

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(false, [mockDoc]))

      const result = await repository.save(scoreData)

      expect(result.success).toBe(true)
      expect(updateDoc).not.toHaveBeenCalled()
    })
  })

  describe('4) No duplicates', () => {
    it('4.1) should query by playerName to prevent duplicates', async () => {
      const scoreData: ScoreData = {
        playerName: 'Eve',
        score: 275,
        yahtzeeBonus: 50,
        timestamp: new Date().toISOString()
      }

      vi.mocked(getDocs).mockResolvedValue(createMockQuerySnapshot(true, []))

      vi.mocked(addDoc).mockResolvedValue(createMockDocReference('doc-5'))

      await repository.save(scoreData)
      
      expect(query).toHaveBeenCalled()
      const queryCall = vi.mocked(query).mock.calls[0]
      expect(queryCall).toContain(where('playerName', '==', 'Eve'))
    })
  })

  describe('5) Error handling', () => {
    it('5.1) should throw SaveScoreError on database failure', async () => {
      const scoreData: ScoreData = {
        playerName: 'Frank',
        score: 200,
        yahtzeeBonus: 0,
        timestamp: new Date().toISOString()
      }

      vi.mocked(getDocs).mockRejectedValue(new Error('Firestore error'))

      await expect(repository.save(scoreData)).rejects.toThrow(SaveScoreError)
    })
  })
})