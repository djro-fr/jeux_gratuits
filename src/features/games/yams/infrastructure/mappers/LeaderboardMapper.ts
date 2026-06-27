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
    return entries.map((entry, index) => {
      let rank = index + 1
      if (index > 0 && entry.score === entries[index - 1].score) {
        rank = 1 
      }
      return this.toDomain(entry, rank)
    })
  }
}