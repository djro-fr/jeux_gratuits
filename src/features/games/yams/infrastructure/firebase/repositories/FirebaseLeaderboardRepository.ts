import { collection, query, orderBy, limit, getDocs, onSnapshot, where } from "firebase/firestore"
import { db } from "../config"

import type { ILeaderboardRepository, LeaderboardScore } from "@/features/games/yams/domain/repositories/ILeaderboardRepository"
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
        return []
      }
      
      const entries = snapshot.docs.map((doc) => ({
        ...doc.data() as FirestoreLeaderboardEntry,
        id: doc.id
      }))
      const leaderboard = LeaderboardMapper.toDomainArray(entries)
      
      return leaderboard
    } catch (error) {
            
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
    } catch {
    
      callback([])
      return () => {}
    }
  }

  async getPlayerRank(playerScore: number): Promise<number> {
    try {
      const scoresRef = collection(db, 'leaderboard')
      const q = query(
        scoresRef,
        where('score', '>', playerScore)
      )
      
      const snapshot = await getDocs(q)
      const scoresAbove = snapshot.size
      
      
      return scoresAbove + 1
    } catch (error) {
      throw new LeaderboardFetchError({
        reason: 'Failed to calculate player rank',
        originalError: error instanceof Error ? error.message : String(error)
      })
    }
  }

  async getPlayerBestScore(playerName: string): Promise<number | null> {
    try {
      const scoresRef = collection(db, 'leaderboard')
      const q = query(
        scoresRef,
        where('playerName', '==', playerName),
        orderBy('score', 'desc'),
        limit(1)
      )
      
      const snapshot = await getDocs(q)
      
      if (snapshot.empty) {
        return null
      }
      
      const bestScore = snapshot.docs[0].data().score
      
      return bestScore
    } catch (error) {

      throw new LeaderboardFetchError({
        reason: 'Failed to fetch player best score',
        playerName,
        originalError: error instanceof Error ? error.message : String(error)
      })
    }
  }

}