# Yam's - Flow

Flow for usecases, based on rules described in Wikipedia : https://en.wikipedia.org/wiki/Yahtzee

## Rules

- The game consists of 13 turns
- In each turn, a player gets three rolls of the dice, although they can choose to end their turn after one or two rolls.
- After the first roll the player can save any dice they want and re-roll the other dice. This procedure is repeated after the second roll. The player has complete choice as to which dice to roll. It is possible to re-roll any dice that were or were not rolled before

## Score Sheet

In the **upper section**, there are six boxes (Aces, Twos, Threes, Fours, Fives, Sixes). The score in each of these boxes is determined by adding the total number of dice matching that case (if three 2, you write 6). If a player scores a total of 63 or more points in these six boxes, a bonus of 35 is added to the upper section score

The **lower section** contains a number of poker-themed categories with specific point values:

- Chance (Any combination) : sum of all dice
- Three of a Kind (At least three dice the same) : sum of all dice
- Four of a Kind (At least four dice the same) : sum of all dice
- Full House (three of one number and two of another, no yahtzee) : 25 points
- Small Straight (Four sequential dice) : 30 points
- Large Straight (Five sequential dice) : 40 points
- Yahtzee (or Yam's, All five dice the same) : 50 points

### Yahtzee bonus

A Yahtzee occurs when all five dice are the same. If the player throws a Yahtzee and has already filled the Yahtzee box with a score of 50, they score a Yahtzee bonus and get an extra 100 points. However, if they throw a Yahtzee and have filled the Yahtzee category with a score of 0, they do not get a Yahtzee bonus.

### Joker rule

In either case they then select a category, as usual. Scoring is the same as normal except that, if the Upper Section box corresponding to the Yahtzee has been used, the Full House, Small Straight and Large Straight categories can be used to score 25, 30 or 40 (respectively) even though the dice do not meet the normal requirement for those categories. In this case, the Yahtzee is said to act as a "Joker"

## Flows

### Start Game

You start a turn

### Start Turn

1. **Can we roll ?** Check if rollNumber < 3
   - If NO → go to "End Turn" (must score)
   - If YES → continue

2. **Roll dice**
   - If rollNumber = 1 → Roll 5 new dice
   - If rollNumber > 1 → Reroll selected dice (from previous roll)

3. **After rolling**
   - Choose to keep some dice and reroll others → back to step 2
   - OR decide to end turn and score → go to "End Turn"

### End Turn

1. Choose which category to score (1 of 13)
2. Score points according to rules
3. Mark category as used (permanent)

### End Game

When 13 turns done (all 13 categories scored):

1. Calculate total score
2. Save to history with date + name/alias
3. Show leaderboard
