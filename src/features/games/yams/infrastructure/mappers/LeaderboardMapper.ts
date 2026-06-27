import type { LeaderboardScore } from "@/features/games/yams/application/repositories/ILeaderboardRepository"

export interface FirestoreLeaderboardEntry {
  id: string
  playerName: string
  score: number
  yahtzeeBonus: number
  timestamp: string
  createdAt?: number
}

export class LeaderboardMapper {
  static toDomain(
    data: FirestoreLeaderboardEntry,
    rank: number
  ): LeaderboardScore {
    return {
      id: data.id,
      rank,
      playerName: data.playerName,
      score: data.score,
      timestamp: new Date(data.timestamp).toLocaleDateString('fr-FR')
    }
  }

  static toDomainArray(
    entries: (FirestoreLeaderboardEntry & { id: string })[] 
  ): LeaderboardScore[] {
    const result: LeaderboardScore[] = []
    let currentRank = 1
    let previousScore: number | null = null
  
    entries.forEach((entry) => {
      if (previousScore !== null && entry.score !== previousScore) {
        currentRank++
      }      
      previousScore = entry.score
      result.push(this.toDomain(entry, currentRank))
    })
  
    return result
  }
}