import { ref, push, set } from "firebase/database"
import { database } from "@/shared/firebase/config"

export class SaveGameScoreUseCase {
  async execute(
    playerName: string,
    score: number,
    yahtzeeBonus: number
  ): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const scoresRef = ref(database, 'leaderboard')
      const newScoreRef = push(scoresRef)
      
      await set(newScoreRef, {
        playerName: playerName.trim() || 'Anonyme',
        score,
        yahtzeeBonus,
        timestamp: new Date().toISOString()
      })
      
      console.log("✅ Score sauvegardé !")
      return { success: true, id: newScoreRef.key || '' }
    } catch (error) {
      console.error("❌ Erreur sauvegarde:", error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }
}