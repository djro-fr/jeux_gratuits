import type { LeaderboardScore } from "@/features/games/yams/application/repositories/ILeaderboardRepository"

export interface FirebaseLeaderboardEntry {
  playerName: string
  score: number
  yahtzeeBonus: number
  timestamp: string
  createdAt?: number
}

export class LeaderboardMapper {
  static toDomain(
    firebaseData: FirebaseLeaderboardEntry,
    rank: number
  ): LeaderboardScore {
    return {
      rank,
      playerName: firebaseData.playerName,
      score: firebaseData.score,
      timestamp: new Date(firebaseData.timestamp).toLocaleDateString('fr-FR')
    }
  }

  static toDomainArray(
    entries: FirebaseLeaderboardEntry[]
  ): LeaderboardScore[] {
    return entries.map((entry, index) =>
      this.toDomain(entry, index + 1)
    )
  }
}