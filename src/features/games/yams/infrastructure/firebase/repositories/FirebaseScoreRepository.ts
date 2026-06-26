import { ref, push, set } from "firebase/database"

import i18n from "@/shared/i18n/i18n";
import type { IScoreRepository, ScoreData } from "../../../application/repositories/IScoreRepository";
import { ScoreMapper } from "../../mappers/ScoreMapper";
import { database } from "../config";

export class FirebaseScoreRepository implements IScoreRepository {
  async save(data: ScoreData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const firebaseData = ScoreMapper.toFirebase(data)
      
      const scoresRef = ref(database, 'leaderboard')
      const newScoreRef = push(scoresRef)
      
      await set(newScoreRef, firebaseData)
      
      console.log(i18n.t('ui.scoreSaved', { ns: 'yams' }))
      return { success: true, id: newScoreRef.key || '' }
    } catch (error) {
      const errorName = error instanceof Error ? error.name : 'unknownError'
      const errorMessage = i18n.t(`errors.${errorName}`, { ns: 'yams' })
      console.error(errorMessage, error instanceof Error ? error.message : error)
      
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      }
    }
  }
}