import { describe, it, expect } from 'vitest'
import { LeaderboardMapper, type FirestoreLeaderboardEntry } from './LeaderboardMapper'
import type { LeaderboardScore } from '@/features/games/yams/application/repositories/ILeaderboardRepository'

const fakeEntry: FirestoreLeaderboardEntry = {
  id: 'doc1',
  playerName: 'Alice',
  score: 300,
  yahtzeeBonus: 1,
  timestamp: '2025-01-15T10:00:00.000Z',
}

const fakeEntries: FirestoreLeaderboardEntry[] = [
  { id: 'doc1', playerName: 'Alice', score: 300, yahtzeeBonus: 1, timestamp: '2025-01-15T10:00:00.000Z' },
  { id: 'doc2', playerName: 'Bob',   score: 250, yahtzeeBonus: 0, timestamp: '2025-02-20T08:30:00.000Z' },
  { id: 'doc3', playerName: 'Carol', score: 200, yahtzeeBonus: 2, timestamp: '2025-03-10T14:00:00.000Z' },
]

describe('Infrastructure, unit testing: LeaderboardMapper', () => {
  describe('1) toDomain', () => {
    it('1.1) should map playerName and score from Firebase entry', () => {
      const result: LeaderboardScore = LeaderboardMapper.toDomain(fakeEntry, 1)

      expect(result.playerName).toBe('Alice')
      expect(result.score).toBe(300)
    })

    it('1.2) should assign the provided rank', () => {
      const result = LeaderboardMapper.toDomain(fakeEntry, 3)

      expect(result.rank).toBe(3)
    })

    it('1.3) should format timestamp as fr-FR locale date', () => {
      const result = LeaderboardMapper.toDomain(fakeEntry, 1)

      expect(result.timestamp).toBe('15/01/2025')
    })

    it('1.4) should not include yahtzeeBonus in the domain output', () => {
      const result = LeaderboardMapper.toDomain(fakeEntry, 1)

      expect(result).not.toHaveProperty('yahtzeeBonus')
    })

    it('1.5) should ignore optional createdAt field', () => {
      const entryWithCreatedAt: FirestoreLeaderboardEntry = {
        ...fakeEntry,
        createdAt: 1700000000000,
      }
      const result = LeaderboardMapper.toDomain(entryWithCreatedAt, 1)

      expect(result).not.toHaveProperty('createdAt')
    })
    it('1.6) should include id in the result', () => {
      const result = LeaderboardMapper.toDomain(fakeEntry, 1)

      expect(result.id).toBe('doc1')
    })
  })

  describe('2) toDomainArray', () => {
    it('2.1) should return an empty array for empty input', () => {
      const result = LeaderboardMapper.toDomainArray([])

      expect(result).toEqual([])
    })
    it('2.2) should assign ranks starting at 1', () => {
      const result = LeaderboardMapper.toDomainArray(fakeEntries)

      expect(result[0].rank).toBe(1)
      expect(result[1].rank).toBe(2)
      expect(result[2].rank).toBe(3)
    })
    it('2.3) should preserve order of entries', () => {
      const result = LeaderboardMapper.toDomainArray(fakeEntries)

      expect(result[0].playerName).toBe('Alice')
      expect(result[1].playerName).toBe('Bob')
      expect(result[2].playerName).toBe('Carol')
    })
    it('2.4) should map all entries', () => {
      const result = LeaderboardMapper.toDomainArray(fakeEntries)

      expect(result).toHaveLength(3)
    })
    it('2.5) should assign same rank for equal scores', () => {
      const entriesWithTie: FirestoreLeaderboardEntry[] = [
        { id: 'doc1', playerName: 'Alice', score: 300, yahtzeeBonus: 1, timestamp: '2025-01-15T10:00:00.000Z' },
        { id: 'doc2', playerName: 'Bob',   score: 300, yahtzeeBonus: 0, timestamp: '2025-02-20T08:30:00.000Z' },
        { id: 'doc3', playerName: 'Carol', score: 200, yahtzeeBonus: 2, timestamp: '2025-03-10T14:00:00.000Z' },
      ]
      const result = LeaderboardMapper.toDomainArray(entriesWithTie)

      expect(result[0].rank).toBe(1)
      expect(result[1].rank).toBe(1) 
      expect(result[2].rank).toBe(3) 
    })

    it('2.6) should handle multiple ties', () => {
      const entriesWithMultipleTies: FirestoreLeaderboardEntry[] = [
        { id: 'doc1', playerName: 'Alice', score: 300, yahtzeeBonus: 1, timestamp: '2025-01-15T10:00:00.000Z' },
        { id: 'doc2', playerName: 'Bob',   score: 300, yahtzeeBonus: 0, timestamp: '2025-02-20T08:30:00.000Z' },
        { id: 'doc3', playerName: 'Carol', score: 300, yahtzeeBonus: 2, timestamp: '2025-03-10T14:00:00.000Z' },
        { id: 'doc4', playerName: 'Dave',  score: 100, yahtzeeBonus: 0, timestamp: '2025-04-05T12:00:00.000Z' },
      ]
      const result = LeaderboardMapper.toDomainArray(entriesWithMultipleTies)

      expect(result[0].rank).toBe(1)
      expect(result[1].rank).toBe(1)
      expect(result[2].rank).toBe(1)
      expect(result[3].rank).toBe(4)
    })
  })
})