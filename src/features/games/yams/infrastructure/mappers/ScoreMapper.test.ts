import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ScoreMapper, type FirebaseScoreData } from './ScoreMapper'
import type { ScoreData } from '../../domain/repositories/IScoreRepository'


const fakeScoreData: ScoreData = {
  playerName: '  Alice  ',
  score: 300,
  yahtzeeBonus: 1,
  timestamp: '2025-01-15T10:00:00.000Z',
}

const fakeFirebaseData: FirebaseScoreData = {
  playerName: 'Bob',
  score: 250,
  yahtzeeBonus: 0,
  timestamp: '2025-02-20T08:30:00.000Z',
  createdAt: 1700000000000,
}

describe('Infrastructure, unit testing: ScoreMapper', () => {
  describe('1) toFirebase', () => {
    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2025-01-15T10:00:00.000Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('1.1) should trim playerName', () => {
      const result = ScoreMapper.toFirebase(fakeScoreData)

      expect(result.playerName).toBe('Alice')
    })

    it('1.2) should preserve score and yahtzeeBonus', () => {
      const result = ScoreMapper.toFirebase(fakeScoreData)

      expect(result.score).toBe(300)
      expect(result.yahtzeeBonus).toBe(1)
    })

    it('1.3) should preserve timestamp', () => {
      const result = ScoreMapper.toFirebase(fakeScoreData)

      expect(result.timestamp).toBe('2025-01-15T10:00:00.000Z')
    })

    it('1.4) should set createdAt to Date.now()', () => {
      const result = ScoreMapper.toFirebase(fakeScoreData)

      expect(result.createdAt).toBe(new Date('2025-01-15T10:00:00.000Z').getTime())
    })
  })

  describe('2) fromFirebase', () => {
    it('2.1) should map playerName, score, yahtzeeBonus and timestamp', () => {
      const result: ScoreData = ScoreMapper.fromFirebase(fakeFirebaseData)

      expect(result.playerName).toBe('Bob')
      expect(result.score).toBe(250)
      expect(result.yahtzeeBonus).toBe(0)
      expect(result.timestamp).toBe('2025-02-20T08:30:00.000Z')
    })

    it('2.2)should not include createdAt in the domain output', () => {
      const result = ScoreMapper.fromFirebase(fakeFirebaseData)

      expect(result).not.toHaveProperty('createdAt')
    })
  })
})