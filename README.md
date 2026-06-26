# JeuxGratuits

Free mini-games built with modern web technologies

## Games

- **Yam's (Yahtzee)**, dice game:
  - 3 rolls per turn, 13 categories
  - Keep/reroll mechanics
  - Score preview & validation
  - Yahtzee bonus detection
  - Complete game flow
  - Global leaderboard with Firebase persistence
  - Multi-language support (FR/EN)
- More coming soon...

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library - Unit & Integration Tests
- **Internationalization:** react-i18next (FR/EN) with namespaces
- **Architecture:** Clean Architecture with Domain-Driven Design
- **State Management:** React Hooks + Custom Hooks
- **Backend/Database:** Firebase Realtime Database
- **Code Quality:** ESLint, SonarLint

## Architecture Patterns

- **Clean Architecture**: Separation of concerns
- **Domain-Driven Design**: Business logic focus
- **Dependency Inversion**: Use Cases inject dependencies
- **Strategy Pattern**: Score calculation strategies
- **Factory Pattern**: Entity creation

### Dependency Flow

```text
domain/
   ↓ (Pure business logic, no outer dependency)
   ↓ (Entities, Rules, Errors)
   
application/
   ├─ dtos/                 (Input/Output Contracts)
   ├─ repositories/         (Interfaces/Abstractions)
   └─ usecases/             (Orchestration)
   
infrastructure/
   └─ firebase/
       ├─ mappers/          (Data transformations)
       └─ repositories/     (Firebase implementations)
   
ui/
   ├─ hooks/                (State logic, testable in isolation)
   ├─ containers/           (Bridge: injects dependencies + manages React state)
   └─ components/           (Pure display, dumb components)
```

**Key Rule:** Inner layers never depend on outer layers.

## Core Principles

### Key Decisions

- **Immutability**: All entities return new instances on state change
- **Error Handling**: Custom error classes with `name` property for i18n mapping
- **Type Safety**: Full TypeScript typing throughout, no `any`
- **Test-Driven**: Tests before or alongside implementation
- **No Framework in Domain**: Pure business logic, 100% reusable
- **Dependency Injection**: All external dependencies injected via constructors
- **Repository Pattern**: Abstract data sources with explicit interfaces
- **Mapper Pattern**: Explicit data transformations between layers
- **Persistence**: Firebase Realtime DB for global leaderboard
- **Security**: Environment variables for sensitive data

### Common Patterns

- **UseCase Pattern**: `execute(input): output`
- **DTO Pattern**: Explicit Input/Output contracts per UseCase
- **Repository Pattern**: Abstract data sources
- **Mapper Pattern**: Domain <> Firebase data transformations
- **Factory Methods**: `static create()`
- **Guard Clauses**: Early returns in UseCases
- **Type Narrowing**: React's if/else if/else for null checks
- **Custom Hooks**: Testable state logic extracted from components

## Testing

### Test Strategy

### Domain Layer (75 tests)

- **Die.test.ts** (12 tests) - Value generation & constraints
- **DiceRoll.test.ts** (20 tests) - Roll mechanics, keeping dice
- **YamsTurn.test.ts** (6 tests) - Turn state management
- **YamsGame.test.ts** (6 tests) - Game orchestration
- **calculateScore.test.ts** (31 tests) - All 13 scoring categories

### Application Layer (33 tests)

- **RollDiceUseCase.test.ts** (4 tests) - Roll execution
- **KeepDiceUseCase.test.ts** (6 tests) - Keep & reroll mechanics
- **ScoreTurnUseCase.test.ts** (6 tests) - Scoring logic + Yahtzee bonus
- **SaveGameScoreUseCase.test.ts** (4 tests) - Score persistence contract
- **GetLeaderboardUseCase.test.ts** (4 tests) - Leaderboard subscription contract
- **YamsScoreBoard.test.ts** (13 tests) - Score tracking

### Infrastructure Layer (15 tests)

- **LeaderboardMapper.test.ts** (9 tests) - Firebase → Domain transformations
- **ScoreMapper.test.ts** (6 tests) - Domain → Firebase transformations

### UI Layer (29 tests)

- **useYamsGame.test.ts** (17 tests) - Game state & handlers
- **useLeaderboard.test.ts** (4 tests) - Leaderboard subscription & state
- **useSaveScore.test.ts** (8 tests) - Save validation & persistence flow

### Integration (5 tests)

- **YamsGameFlow.test.ts** (4 tests) - Multi-turn scenarios
- **YamsGameComplete.test.ts** (1 test) - Full game simulation

### Test Summary

- **Total: 161 tests, all passing**
- Coverage: >90% Domain & Application layers, UI hooks fully covered
- Framework: Vitest + React Testing Library

## Data Flow Example: Scoring

User clicks "Score"
↓
useYamsGame.handleScore()
↓
ScoreTurnUseCase.execute(ScoreTurnInput)
├─ 1. Validation (Domain Entity)
├─ 2. Calculate (Domain Rule)
├─ 3. Update (Domain Entity)
└─ Returns ScoreTurnOutput
↓
setScoreBoard() → React re-render
↓
User finishes game, clicks "Save"
↓
useSaveScore.handleSaveAndRestart()
├─ 1. Validate playerName
├─ 2. SaveGameScoreUseCase.execute(SaveGameScoreInput)
│   ├─ ScoreMapper.toFirebase() ← Transform data
│   ├─ FirebaseScoreRepository.save() ← Persist
│   └─ Returns SaveGameScoreOutput
└─ onSuccess() → handleRestart()

## Doc

### Yams

- [Flow for usecases](./docs/yams-flow.md)

## TO DO

- [ ] Component tests (React Testing Library)
- [ ] Animation & transitions
- [ ] Android build & Google Play Store publishing
- [ ] More games

## Status

**In development** - Yams Core Features Complete + Firebase Leaderboard + Clean Architecture Refactor + Explicit Mappers + UI Hooks + Full Hook Test Coverage

**Last Updated:** June 26, 2026
