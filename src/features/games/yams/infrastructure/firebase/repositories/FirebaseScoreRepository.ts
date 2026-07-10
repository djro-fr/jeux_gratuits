import { collection, addDoc, Timestamp, query, where, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../config"
import i18n from "@/shared/i18n/i18n"
import type { IScoreRepository, ScoreData } from "@/features/games/yams/domain/repositories/IScoreRepository"
import { SaveScoreError } from "../../errors/YamsErrors"

export class FirebaseScoreRepository implements IScoreRepository {
  async save(data: ScoreData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      const scoresRef = collection(db, 'leaderboard')

      const q = query(scoresRef, where('playerName', '==', data.playerName.trim()))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        const docRef = await addDoc(scoresRef, {
          playerName: data.playerName.trim(),
          score: data.score,
          yahtzeeBonus: data.yahtzeeBonus,
          timestamp: data.timestamp,
          createdAt: Timestamp.now()
        })
        console.log(i18n.t('ui.scoreSaved', { ns: 'yams' }))
        return { success: true, id: docRef.id }
      }else{
        const existingDoc = snapshot.docs[0]
        const existingScore = existingDoc.data().score
        
        if (data.score > existingScore) {
          await updateDoc(existingDoc.ref, {
            score: data.score,
            yahtzeeBonus: data.yahtzeeBonus,
            timestamp: data.timestamp
          })
          console.log(i18n.t('ui.scoreSaved', { ns: 'yams' }))
        }
        return { success: true, id: existingDoc.id }
      }
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