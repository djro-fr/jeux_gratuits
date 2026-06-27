import { collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../config"
import i18n from "@/shared/i18n/i18n"
import type { IScoreRepository, ScoreData } from "@/features/games/yams/application/repositories/IScoreRepository"
import { SaveScoreError } from "../../errors/YamsErrors"

export class FirebaseScoreRepository implements IScoreRepository {
  async save(data: ScoreData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const scoresRef = collection(db, 'leaderboard')
      const docRef = await addDoc(scoresRef, {
        playerName: data.playerName.trim(),
        score: data.score,
        yahtzeeBonus: data.yahtzeeBonus,
        timestamp: data.timestamp,
        createdAt: Timestamp.now()
      })

      console.log(i18n.t('ui.scoreSaved', { ns: 'yams' }))
      return { success: true, id: docRef.id }
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'unknownError'
      const errorMessage = i18n.t(`errors.${errorName}`, { ns: 'yams' })
      console.error(errorMessage, error)
      throw new SaveScoreError({
        originalError: error instanceof Error ? error.message : String(error),
        playerName: data.playerName,
        score: data.score
      })
    }
  }
}