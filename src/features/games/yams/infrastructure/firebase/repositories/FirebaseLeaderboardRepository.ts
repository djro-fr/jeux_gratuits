import { collection, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore"
import { db } from "../config"
import i18n from "@/shared/i18n/i18n"

import type { ILeaderboardRepository, LeaderboardScore } from "@/features/games/yams/application/repositories/ILeaderboardRepository"
import { LeaderboardMapper, type FirestoreLeaderboardEntry } from "../../mappers/LeaderboardMapper"
import { LeaderboardFetchError, LeaderboardMapError, LeaderboardSubscribeError } from "../../errors/YamsErrors"

export class FirebaseLeaderboardRepository implements ILeaderboardRepository {

  async getTopScores(limitCount: number): Promise<LeaderboardScore[]> {
    try {
      const scoresRef = collection(db, 'leaderboard')
      const q = query(
        scoresRef,
        orderBy('score', 'desc'),
        limit(limitCount)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {        
        console.info(i18n.t('ui.noScores', { ns: 'yams' }))        
        return []
      }
      
      const entries = snapshot.docs.map((doc) => ({
        ...doc.data() as FirestoreLeaderboardEntry,
        id: doc.id
      }))
      const leaderboard = LeaderboardMapper.toDomainArray(entries)
            
      console.log(i18n.t('ui.leaderboardLoaded', { ns: 'yams', count: leaderboard.length }))
      
      return leaderboard
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'unknownError'      
      const errorMessage = i18n.t(`errors.${errorName}`, { ns: 'yams' })
      console.error(errorMessage, error)
      throw new LeaderboardFetchError({
        reason: 'Failed to fetch leaderboard from Firestore',
        limit: limitCount,
        originalError: error instanceof Error ? error.message : String(error)
      })
    }
  }

  subscribe(callback: (scores: LeaderboardScore[]) => void): () => void {
    try {
      const scoresRef = collection(db, 'leaderboard')
      const q = query(
        scoresRef,
        orderBy('score', 'desc'),
        limit(20)
      )
      
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          try {
            const entries = snapshot.docs.map((doc) => ({
              ...doc.data() as FirestoreLeaderboardEntry,
              id: doc.id
            }))
            const leaderboard = LeaderboardMapper.toDomainArray(entries)
            callback(leaderboard)
          } catch (error) {
            throw new LeaderboardMapError({
              reason: 'Failed to map leaderboard data',
              originalError: error instanceof Error ? error.message : String(error)
            })
          }
        },
        (error) => {
          throw new LeaderboardSubscribeError({
            reason: 'Firebase subscription error',
            originalError: error instanceof Error ? error.message : String(error)
          })
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