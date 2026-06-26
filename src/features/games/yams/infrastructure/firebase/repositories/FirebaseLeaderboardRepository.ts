import { ref, query, orderByChild, limitToFirst, onValue } from "firebase/database"

import type { 
  ILeaderboardRepository, 
  LeaderboardScore 
} from "@/features/games/yams/application/repositories/ILeaderboardRepository"

import { LeaderboardMapper, type FirebaseLeaderboardEntry } from "../../mappers/LeaderboardMapper";
import { LeaderboardFetchError, LeaderboardMapError, LeaderboardSubscribeError } from "../../errors/YamsErrors";
import { database } from "../config";
import i18n from "@/shared/i18n/i18n";

export class FirebaseLeaderboardRepository implements ILeaderboardRepository {
  async getTopScores(limit: number): Promise<LeaderboardScore[]> {
    return new Promise((resolve) => {
      try {
        const scoresRef = ref(database, 'leaderboard')
        const leaderboardQuery = query(
          scoresRef,
          orderByChild('score'),
          limitToFirst(limit * 2)
        )
        
        onValue(
          leaderboardQuery,
          (snapshot) => {
            try {
              const data = snapshot.val()
              const entries: FirebaseLeaderboardEntry[] = data ? Object.values(data) : []
              
              if (entries.length === 0) {
                console.info(i18n.t('ui.noScores', { ns: 'yams' }))
                resolve([])
                return
              }
              
              const sorted = entries
                .toSorted((a: FirebaseLeaderboardEntry, b: FirebaseLeaderboardEntry) => 
                  b.score - a.score
                )
                .slice(0, limit)
              
              const leaderboard = LeaderboardMapper.toDomainArray(sorted)
              
              console.log(i18n.t('ui.leaderboardLoaded', { ns: 'yams', count: leaderboard.length }))
              resolve(leaderboard)
            } catch (error) {
              throw new LeaderboardMapError(error)
            }
          },
          (error) => {
            throw new LeaderboardFetchError(error)
          }
        )
      } catch (error) {
        const errorName = error instanceof Error ? error.name : 'unknownError'
        const errorMessage = i18n.t(`errors.${errorName}`, { ns: 'yams' })
        console.error(errorMessage, error)
        resolve([])
      }
    })
  }

  subscribe(callback: (scores: LeaderboardScore[]) => void): () => void {
    try {
      const scoresRef = ref(database, 'leaderboard')
      const leaderboardQuery = query(
        scoresRef,
        orderByChild('score'),
        limitToFirst(100)
      )
      
      const unsubscribe = onValue(
        leaderboardQuery,
        (snapshot) => {
          try {
            const data = snapshot.val()
            const entries: FirebaseLeaderboardEntry[] = data ? Object.values(data) : []
            
            const sorted = entries
              .toSorted((a: FirebaseLeaderboardEntry, b: FirebaseLeaderboardEntry) =>
                b.score - a.score
              )
              .slice(0, 50)
            
            const leaderboard = LeaderboardMapper.toDomainArray(sorted)
            
            callback(leaderboard)
            console.log(i18n.t('ui.leaderboardUpdated', { ns: 'yams' }))
          } catch (error) {
            throw new LeaderboardMapError(error)
          }
        },
        (error) => {
          throw new LeaderboardSubscribeError(error)
        }
      )
      
      return unsubscribe
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'unknownError'
      const errorMessage = i18n.t(`errors.${errorName}`, { ns: 'yams' })
      console.error(errorMessage, error)
      callback([])
      return () => {}
    }
  }
}