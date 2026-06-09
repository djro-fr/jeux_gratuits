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
- Full House (three of one number and two of another) : 25 points
- Small Straight (Four sequential dice) : 30 points
- Large Straight (Five sequential dice) : 40 points
- Yahtzee (or Yam's, All five dice the same) : 50 points

## Flows

### Start Game

You start a turn

### Start Turn

1. Check if we **can roll** (if the turn number if less than 3) => YamsTurn.canroll()
2. If not, end of turn
3. Roll the 5 dice at the same time, or some of the dice from the previous turn. => YamsTurn.nextRoll(?indices)
4. After the dice are rolled, you can chose to keep aside some of the dice and roll the others for another turn...
5. ...or decide to end the turn and score right now

### End Turn

1. If you can't roll (because turn number  >= 3), you have to end the turn. Or if you chose to end the turn and score.
2. When you score, you decide to check one of the 13 boxes of the score sheet and add the points according to the rules. When a box is checked, it is definitive.

### End Game

When 13 turns, the game is finished, you have to add the scores of the 13 cases.
The app keeps an history of your last score with the date and your name or alias + highest score
You can post the score to the social media to brag
