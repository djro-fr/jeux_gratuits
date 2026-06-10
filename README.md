# JeuxGratuits

Free mini-games built with modern web technologies

## Games

- **Yam's**, dice game
- More coming soon...

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Testing:** Unit testing with Vitest (Domain test OK)
- **Internationalization:** react-i18next (FR/EN)
- **Architecture:** Clean Architecture with Domain-Driven Design
- **State Management:** React Hooks + Custom Context
- **Code Quality:** ESLint, SonarLint

## Architecture

Clean Architecture with Domain-Driven Design

### Project Structure

src/
├── core/                     # Shared business rules (no framework dependency)
├── features/games/           # Game domains (isolated & independent)
│   └── yams/
│       ├── domain/           # Business logic (Dice, HandEvaluator)
│       ├── application/      # Use Cases (RollDiceUseCase)
│       ├── infrastructure/   # Adapters (mappers, presenters)
│       ├── ui/
│       │   ├── components/   # Dumb components (display only)
│       │   └── containers/   # Smart components (orchestration)
│       └── di/               # Dependency Injection
├── shared/                   # Reusable components & utilities
├── ui/                       # React routing & layouts
└── di/                       # Global DI container

### Dependency Flow

domain/   ←------------------ Pure business logic
↓ (no outer dependency)
application/   ←------------- Use Cases (orchestration)
↓ (no outer dependency)
infrastructure/  ←----------- Adapters (HTTP, mappers, presenters)
↓ (no outer dependency)
ui/containers/   ←----------- Bridge: injects use cases + manages React state
↓
ui/components/   ←----------- Pure display (dumb components)

**Key Rule:** Inner layers never depend on outer layers.

### Example: Rolling Dice

1. **Component** user clicks → calls container
2. **Container** injects `RollDiceUseCase` → calls execute()
3. **Use Case** calls domain logic → `HandEvaluator.evaluate()`
4. **Domain** returns result (pure, no side effects)
5. **Container** updates React state → re-renders
6. **Component** displays new dices

## Core Principles

### Immutability

All domain entities are **immutable**. Methods never modify internal state (`this`), they return new instances instead.

**Example:**

```typescript
// ❌ WRONG
turn.toggleKeep(0)  // Modifies turn in place
console.log(turn.getDiceRoll())  // turn has changed

// ✅ RIGHT
const newTurn = turn.toggleKeep(0)  // Returns new instance
console.log(turn.getDiceRoll())  // turn is unchanged
console.log(newTurn.getDiceRoll())  // newTurn has the change
```

**Benefits:**

- Predictable state (no side effects)
- Easy to track changes
- React state management simplified
- Thread-safe (relevant for Node.js backend later)

### Single Responsibility

Each class has one reason to change.

- `Dice` = one die (value, kept state)
- `DiceRoll` = 5 dice collection
- `YamsTurn` = turn logic (max 3 rolls)
- `YamsGame` = game progression (13 turns)

## Testing

### Test Strategy

- **Domain Layer:** Full unit test coverage (44 tests)
  - Entities: Die (12), DiceRoll (20), YamsTurn (6), YamsGame (6)
  - Error handling: invalidDiceValueError, maxTurnsReachedError, gameAlreadyFinishedError
  - Focus: Business rules, immuability, edge cases

- **Application Layer:** Use Cases + integration tests (TODO)
- **Presentation Layer:** Component tests (TODO)

## Doc

### Yams

- [Flow for usecases](./docs/yams-flow.md)

## Status

In development
