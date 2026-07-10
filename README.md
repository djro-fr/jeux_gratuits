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
  - **Score marking animation** (scale pop 600ms with interaction blocking)
- More coming soon...

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest + React Testing Library - Unit & Integration Tests
- **Internationalization:** react-i18next (FR/EN) with namespaces
- **Architecture:** Clean Architecture with Domain-Driven Design
- **State Management:** React Hooks + Custom Hooks
- **Backend/Database:** Firebase Firestore with composite indexes
- **Mobile:** Capacitor (Android via Android Studio)
- **Code Quality:** ESLint, SonarLint

## Security

- **XSS Protection**: React automatic escaping + input validation (regex)
- **Firestore Rules**: Allow read/create only, deny update/delete
- **Content Security Policy**: Meta CSP header with 'self' scripts
- **Rate Limiting**: 5-second cooldown per player (prevents abuse)
- **Duplicate Prevention**: Upsert logic (query playerName → create new OR update best score only)
- **Validation**: playerName (1-10 chars, allowed characters), score (non-negative)
- **No Secrets**: All sensitive config via environment variables

**Note**: Leaderboard is public (no authentication).
Firestore rules validate data, rate limiting prevents abuse.

## Architecture Patterns

- **Clean Architecture**: Separation of concerns (Domain → Application → UI)
- **Domain-Driven Design**: Business logic focus via Aggregate Root
- **Dependency Inversion**: Use Cases inject dependencies
- **Strategy Pattern**: Score calculation strategies
- **Factory Pattern**: Entity creation (static `create()` methods)
- **Repository Pattern**: Abstract data sources
- **Upsert Pattern**: Prevent duplicates with intelligent create/update logic

### Dependency Flow

```text
domain/
   ├─ aggregates/          (YamsGame - Aggregate Root)
   ├─ valueObjects/        (Die, DiceRoll, YamsTurn, YamsScoreBoard)
   ├─ rules/               (calculateScore, business logic)
   ├─ repositories/        (Interfaces/Abstractions)
   └─ errors/              (Custom errors with i18n keys)
   ↑ (Pure business logic, zero external dependencies)
   
application/
   ├─ dtos/                (Input/Output Contracts)
   ├─ usecases/            (Orchestration, inject domain)
   │   ├─ RollDiceUseCase
   │   ├─ KeepDiceUseCase
   │   ├─ RecordScoreUseCase
   │   ├─ SaveGameScoreUseCase
   │   ├─ GetPlayerBestScoreUseCase
   │   └─ GetLeaderboardUseCase
   └─ errors/              (Application-level errors)
   ↑ (Orchestrates Domain)
   
infrastructure/
   ├─ firebase/
   │   ├─ mappers/         (Data transformations: Domain ↔ Firebase)
   │   │   ├─ LeaderboardMapper
   │   │   └─ ScoreMapper
   │   └─ repositories/    (Firebase implementations)
   │       ├─ FirebaseScoreRepository (with upsert)
   │       └─ FirebaseLeaderboardRepository
   └─ persistence/
   ↑ (External services)
   
ui/
   ├─ hooks/               (State logic, custom hooks)
   │   ├─ useYamsGame      (Game orchestration)
   │   ├─ useLeaderboard   (Leaderboard queries)
   │   └─ useSaveScore     (Score persistence)
   ├─ containers/          (Bridge: inject dependencies + React state)
   │   └─ YamsGameContainer
   └─ components/          (Pure display, dumb components)
   ↑ (React framework)
```

**Key Rule:** Inner layers never depend on outer layers.

## Core Principles

### Key Decisions

- **Immutability**: All entities return new instances on state change
- **Error Handling**: Custom error classes with `name` property for i18n mapping
- **Type Safety**: Full TypeScript typing throughout, no `any`
- **Test-Driven**: 218 passing tests covering all layers (21 test files)
- **No Framework in Domain**: Pure business logic, 100% reusable
- **Dependency Injection**: All external dependencies injected via constructors
- **Repository Pattern**: Abstract data sources with explicit interfaces
- **Mapper Pattern**: Explicit data transformations between layers
- **Aggregate Root**: YamsGame orchestrates all state (scoreBoard, turns, validation)
- **Single State**: React hook uses one `useState<YamsGame>`, derived values accessed via getters
- **UseCase Pattern**: Each action goes through a UseCase (RollDice, KeepDice, RecordScore)
- **Rate Limiting**: 5-second cooldown between score saves
- **Upsert Logic**: Query → create new player OR update best score only
- **Animation UX**: Scale pop (1.0 → 1.15 → 1.0) over 600ms with interaction blocking

### Common Patterns

- **UseCase Pattern**: `execute(input): output` with domain orchestration
- **DTO Pattern**: Explicit Input/Output contracts per UseCase
- **Repository Pattern**: Abstract data sources behind interfaces
- **Mapper Pattern**: Domain ↔ Firebase data transformations
- **Factory Methods**: `static create()` for safe entity construction
- **Guard Clauses**: Early returns in UseCases for validation
- **Type Narrowing**: React's if/else if/else for null checks
- **Custom Hooks**: Testable state logic extracted from components
- **Immutability**: All mutations return new instances (immutable data structures)

## Testing

### Test Breakdown (218 total, 21 files)

- **Domain Layer** (74 tests)
  - Die (14 tests), DiceRoll (20 tests), YamsTurn (10 tests)
  - YamsGame Aggregate (17 tests) - *with canRoll(), canReroll(), canScore() guards*
  - YamsScoreBoard (14 tests)
  - calculateScore (31 tests)

- **Application Layer** (60 tests)
  - UseCases (34 tests): RollDice, KeepDice, RecordScore, SaveGameScore, GetLeaderboard, GetPlayerBestScore
  - Integration Tests (12 tests): Complete game flows
  - Hook Tests (15 tests): useYamsGame state management

- **Infrastructure Layer** (41 tests)
  - FirebaseScoreRepository (6 tests) - Upsert logic validation
  - FirebaseLeaderboardRepository (15 tests) - Queries, rank calculation, subscriptions
  - LeaderboardMapper (12 tests)
  - ScoreMapper (6 tests)

- **UI Layer** (47 tests)
  - Hooks (47 tests): useYamsGame (15), useLeaderboard (4), useSaveScore (16), GetLeaderboard (4), other (8)

## Data Flow Example: Scoring with Animation

```text
User clicks "Score" button
↓
Score cell animates (scale 1.0 → 1.15 → 1.0 over 600ms)
Interactions blocked during animation
↓
After 600ms timeout:
useYamsGame.handleScore(category)
↓
RecordScoreUseCase.execute({ game, category })
├─ 1. Get scoreBoard + dice from game
├─ 2. Validate category available
├─ 3. Calculate score (Domain Rule)
├─ 4. Add score to scoreBoard (immutable)
├─ 5. Handle Yahtzee bonus
├─ 6. Create game with scoreBoard via game.recordScore()
├─ 7. game.validateTurn() advances to next turn or ends game
└─ Returns YamsGame (updated)
↓
setGame(updatedGame) → React re-render
↓
scoreBoard & yamsTurn updated via getters
↓
User finishes game (13 turns), clicks "Save"
↓
useSaveScore.handleSaveAndRestart()
├─ 1. Validate playerName (1-10 chars)
├─ 2. SaveGameScoreUseCase.execute(SaveGameScoreInput)
│   ├─ ScoreMapper.toFirebase() ← Transform data
│   ├─ FirebaseScoreRepository.save() ← Upsert:
│   │   ├─ Query existing playerName
│   │   ├─ If new: addDoc() (create new doc)
│   │   ├─ If exists + score better: updateDoc() (update only)
│   │   ├─ If exists + score worse: skip (keep best)
│   │   └─ Return success
│   └─ Returns SaveGameScoreOutput
└─ onSuccess() → Restart game with empty scoreBoard
```

## Firebase Setup

### Composite Indexes (firestore.indexes.json)

Required for optimal query performance:

```json
{
  "indexes": [
    {
      "collectionGroup": "leaderboard",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "playerName", "order": "ASCENDING" },
        { "fieldPath": "score", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "leaderboard",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "score", "order": "DESCENDING" },
        { "fieldPath": "createdAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

**Deploy indexes:**

```bash
firebase deploy --only firestore:indexes
```

### Security Rules (firestore.rules)

```firestore
rules_version = '3';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document=**} {
      allow read;
      allow create: if request.auth == null || request.auth.uid != null;
      allow update, delete: if false;
    }
  }
}
```

## Documentation

### Yams

- [Game Flow & UseCases](./docs/yams-flow.md)

## TO DO

- [ ] Component visual tests (Storybook)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance optimizations
- [ ] Additional games (Dice Wars, Memory)

## Status

**Complete - MVP v1.1.0** :

- ✅ Yams game with full rule implementation (13 categories)
- ✅ Firebase Leaderboard (Firestore with upsert + duplicate prevention)
- ✅ Clean Architecture + DDD with Aggregate Root
- ✅ **218 comprehensive tests** across 21 files
- ✅ Multi-language support (FR/EN)
- ✅ Mobile responsive UI (Web + Android via Capacitor)
- ✅ Score marking animation (scale pop with interaction blocking)
- ✅ Best-score-only leaderboard
- ✅ Android app v1.1.0 with native launcher icons
- ✅ Firestore composite indexes & security rules

**Key Achievements:**

- YamsGame as orchestrating Aggregate Root with immutable state
- Upsert pattern for duplicate prevention + best-score-only logic
- Scale animation with timeout-based interaction blocking
- Full test coverage across all layers (Domain → Infrastructure → UI)
- Production-ready Firestore configuration with indexes

**Last Updated:** July 10, 202
