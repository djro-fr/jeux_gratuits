# JeuxGratuits

Free mini-games built with modern web technologies

## Games

- **Yam's (Yahtzee)**, dice game:
  - 3 rolls per turn, 13 categories
  - Keep/reroll mechanics
  - Score preview & validation
  - Yahtzee bonus detection
  - Complete game flow
- More coming soon...

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Testing:** Vitest - Unit & Integration Tests
  - Domain unit tests
  - Application: unit tests + integration scenarios
  - Presentation: TODO
- **Internationalization:** react-i18next (FR/EN) with namespaces
- **Architecture:** Clean Architecture with Domain-Driven Design
- **State Management:** React Hooks + Custom Context
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
   ↓ (Use Cases, orchestration, no outer dependency)
   ↓ (RollDiceUseCase, KeepDiceUseCase, ScoreTurnUseCase)
   
infrastructure/
   ↓ (Adapters: HTTP, mappers, presenters)
   
ui/containers/
   ↓ (Bridge: injects use cases + manages React state)
   ↓ (YamsGameContainer)
   
ui/components/
   ↓ (Pure display, dumb components)
   ↓ (DiceDisplay, ScoreBoard, ErrorModal)
```

**Key Rule:** Inner layers never depend on outer layers.

## Core Principles

### Key Decisions

- **Immutability**: All entities return new instances on state change
- **Error Handling**: Custom error classes with `name` property for i18n mapping
- **Type Safety**: Full TypeScript typing throughout
- **Test-Driven**: Tests before or alongside implementation
- **No Framework in Domain**: Pure business logic, 100% reusable

### Common Patterns

- **UseCase Pattern**: `execute(input): output`
- **DTO Pattern**: Input/Output contracts
- **Factory Methods**: `static create()`
- **Guard Clauses**: Early returns in UseCases
- **Type Narrowing**: React's if/else if/else for null checks

## Testing

### Test Strategy

### Domain Layer (75 tests)

- **Die.test.ts** (12 tests) - Value generation & constraints
- **DiceRoll.test.ts** (20 tests) - Roll mechanics, keeping dice
- **YamsTurn.test.ts** (6 tests) - Turn state management
- **YamsGame.test.ts** (6 tests) - Game orchestration
- **calculateScore.test.ts** (31 tests) - All 13 scoring categories

### Application Layer (32 tests)

- **RollDiceUseCase.test.ts** (4 tests) - Roll execution
- **KeepDiceUseCase.test.ts** (6 tests) - Keep & reroll mechanics
- **ScoreTurnUseCase.test.ts** (5 tests) - Scoring logic + Yahtzee bonus
- **YamsScoreBoard.test.ts** (13 tests) - Score tracking
- **YamsGameFlow.test.ts** (4 tests) - Integration scenarios

### Test Summary

- **Total: 107 tests, all passing**
- Coverage: >90% Domain Layer
- Framework: Vitest

## Doc

### Yams

- [Flow for usecases](./docs/yams-flow.md)

## TO DO

- [ ] Leaderboard with persistence
- [ ] Presentation Layer unit tests
- [ ] Animation & transitions
- [ ] Sound effects (Tone.js optional)
- [ ] Android & App Store Publify

## Status

In development, Yams Core Features Completed

**Last Updated:** June 23, 2026
