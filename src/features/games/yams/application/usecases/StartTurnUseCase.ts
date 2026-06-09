import { YamsTurn } from '../../domain/entities/YamsTurn'

export class StartTurnUseCase {
  execute(): YamsTurn {
    return new YamsTurn()
  }
}