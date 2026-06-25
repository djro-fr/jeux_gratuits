import { ref, query, orderByChild, limitToFirst, onValue } from "firebase/database"
import { database } from "@/shared/firebase/config"

export interface LeaderboardScore {
  rank: number
  playerName: string
  score: number
  timestamp: string
}

interface FirebaseScore {  
  playerName: string
  score: number
  yahtzeeBonus: number
  timestamp: string
}

export class GetLeaderboardUseCase {
  execute(callback: (scores: LeaderboardScore[]) => void): () => void {
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
          const data = snapshot.val()
          const scores: FirebaseScore[] = data ? Object.values(data) : [] 
          
          const leaderboard = scores
            .toSorted((a: FirebaseScore, b: FirebaseScore) => b.score - a.score)  
            .slice(0, 10)
            .map((score: FirebaseScore, index: number) => ({  
              rank: index + 1,
              playerName: score.playerName,
              score: score.score,
              timestamp: new Date(score.timestamp).toLocaleDateString('fr-FR')
            }))
          
          callback(leaderboard)
        },
        (error: unknown) => {
          console.error("❌ Erreur lecture leaderboard:", error)
          callback([])
        }
      )
      
      return unsubscribe 
    } catch (error: unknown) {
      console.error("❌ Erreur config leaderboard:", error)
      callback([])
      return () => {}
    }
  }
}