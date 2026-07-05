import type { ILeaderboardRepository } from '../../domain/repositories/ILeaderboardRepository'

export interface GetPlayerBestScoreInput {
  playerName: string
}

export interface GetPlayerBestScoreOutput {
  bestScore: number | null
  isNewPlayer: boolean
  canSave: boolean
}

export class GetPlayerBestScoreUseCase {
  private readonly leaderboardRepository: ILeaderboardRepository

  constructor(leaderboardRepository: ILeaderboardRepository) {
    this.leaderboardRepository = leaderboardRepository
  }

  async execute(input: GetPlayerBestScoreInput): Promise<GetPlayerBestScoreOutput> {
    const { playerName } = input

    const bestScore = await this.leaderboardRepository.getPlayerBestScore(playerName)

    return {
      bestScore,
      isNewPlayer: bestScore === null,
      canSave: bestScore === null 
    }
  }
}