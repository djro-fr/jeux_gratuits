import type { ILeaderboardRepository, LeaderboardScore } from "../../domain/repositories/ILeaderboardRepository";


export class GetLeaderboardUseCase {
  readonly repository: ILeaderboardRepository

  constructor(repository: ILeaderboardRepository) {    
    this.repository = repository
  } 

  execute(callback: (scores: LeaderboardScore[]) => void): () => void {
    return this.repository.subscribe(callback)  
  }
}