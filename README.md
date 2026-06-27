# JeuxGratuits

Free mini-games built with modern web technologies.
Built as a portfolio project to demonstrate Clean Architecture, Testing, and Modern React practices.

## Games

- **Yam's (Yahtzee)**, dice game:
  - 3 rolls per turn, 13 categories
  - Keep/reroll mechanics
  - Score preview & validation
  - Yahtzee bonus detection
  - Complete game flow
  - Global leaderboard with Firebase persistence (Firestore)
  - Multi-language support (FR/EN)
- More coming soon...

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library - Unit & Integration Tests
- **Internationalization:** react-i18next (FR/EN) with namespaces
- **Architecture:** Clean Architecture with Domain-Driven Design
- **State Management:** React Hooks + Custom Hooks
- **Backend/Database:** Firebase Firestore
- **Code Quality:** ESLint, SonarLint

## Security

- **XSS Protection**: React automatic escaping + input validation (regex)
- **Firestore Rules**: Allow read/create only, deny update/delete
- **Content Security Policy**: Meta CSP header with 'self' scripts
- **Rate Limiting**: 5-second cooldown per player (prevents abuse)
- **Validation**: playerName (1-10 chars, allowed characters), score (non-negative)
- **No Secrets**: All sensitive config via environment variables

**Note**: Leaderboard is public (no authentication).
Firestore rules validate data, rate limiting prevents abuse.

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
- **Security**: Environment variables + CSP + Input validation + Rate limiting
- **Rate Limiting**: 5-second cooldown between score saves

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

### Test Breakdown

- **Domain Layer** (74 tests)
  - Die (14 tests), DiceRoll (20 tests), YamsTurn (10 tests)
  - YamsGame (9 tests), YamsScoreBoard (14 tests)
  - calculateScore (31 tests)

- **Application Layer** (60 tests)
  - UseCases (34 tests): RollDice, KeepDice, ScoreTurn, SaveGameScore, GetLeaderboard
  - YamsScoreBoard (14 tests)
  - Integration Tests (12 tests)

- **Infrastructure Layer** (12 tests)
  - LeaderboardMapper (12 tests)

- **UI Layer** (27 tests)
  - Hooks (27 tests): useYamsGame, useLeaderboard, useSaveScore

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

- [ ] Animations & transitions
- [ ] Component visual tests (Storybook)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance optimizations
- [ ] Android/iOS build (Capacitor)
- [ ] Additional games

## Status

**Complete - MVP** :

- Yams game with full rule implementation
- Firebase Leaderboard (Firestore)
- Clean Architecture + DDD
- 185 comprehensive tests
- Multi-language support (FR/EN)
- Mobile responsive UI

**Last Updated:** June 27, 2026
