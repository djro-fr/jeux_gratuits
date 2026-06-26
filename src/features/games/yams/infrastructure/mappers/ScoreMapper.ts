import type { ScoreData } from "../../application/repositories/IScoreRepository"

export interface FirebaseScoreData {
  playerName: string
  score: number
  yahtzeeBonus: number
  timestamp: string
  createdAt: number
}

export class ScoreMapper {  
  static toFirebase(data: ScoreData): FirebaseScoreData {
    return {
      playerName: data.playerName.trim(),      
      score: data.score,
      yahtzeeBonus: data.yahtzeeBonus,
      timestamp: data.timestamp,
      createdAt: Date.now()       
    }
  }  
  static fromFirebase(data: FirebaseScoreData): ScoreData {
    return {
      playerName: data.playerName,
      score: data.score,
      yahtzeeBonus: data.yahtzeeBonus,
      timestamp: data.timestamp
    }
  }
}