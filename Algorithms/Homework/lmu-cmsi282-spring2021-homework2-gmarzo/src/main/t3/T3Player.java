package main.t3;

import java.util.*;

/**
 * Artificial Intelligence responsible for playing the game of T3!
 * Implements the alpha-beta-pruning mini-max search algorithm
 */
public class T3Player {
    
    /**
     * Workhorse of an AI T3Player's choice mechanics that, given a game state,
     * makes the optimal choice from that state as defined by the mechanics of
     * the game of Tic-Tac-Total.
     * Note: In the event that multiple moves have equivalently maximal minimax
     * scores, ties are broken by move col, then row, then move number in ascending
     * order (see spec and unit tests for more info). The agent will also always
     * take an immediately winning move over a delayed one (e.g., 2 moves in the future).
     * @param state The state from which the T3Player is making a move decision.
     * @return The T3Player's optimal action.
     */
    public T3Action choose (T3State state) {
        double alpha = Double.MIN_VALUE;
        double beta = Double.MAX_VALUE;

        return alphaBeta(state, alpha, beta, true).action;
    }
    
    // >> [LN] Oh no! You modified the public interface of T3Player, which was
    // explicitly forbidden by the instructions (all helpers should've been private). (-1)
    // Also, remember to remove these TODO comments after you, well, do them!
    // TODO: Implement your alpha-beta pruning recursive helper here!
    public Tuple alphaBeta(T3State state, double alpha, double beta, boolean maxPlayer){
        Map<T3Action, T3State> moves = state.getTransitions();
        
        for (Map.Entry<T3Action, T3State> move : moves.entrySet()) {
            Tuple bestMove = new Tuple(move.getKey(), 0.5);
            // >> [LN] Great job identifying the different terminal condition scores, but rather than having
            // arbitrary magic numbers denote the different outcomes, it would be more readable to make these
            // private static constants so that their purpose and origins are more obvious.
            if (state.isWin()) {
                if (maxPlayer) {
                    bestMove.mmScore = 0.0;
                    return bestMove;
                }
                bestMove.mmScore = 1.0;
                return bestMove;
            }
            
            if (state.isTie()) {
                bestMove.mmScore = 0.5;
                return bestMove;
            }
            
            // >> [LN] No deduction but just a small note -- I know the pseudocode had a boolean parameter to decide 
            // the player turn, and that works/is functional! But stylistically, could be improved by using something like
            // an Enum parameter (like a playerTurn enum or something) that will more clearly indicate whose turn it is. 
            if (maxPlayer) {
                Tuple kid = new Tuple(move.getKey(), 0.5);
                // >> [LN] Although it was in the pseudocode reference, `v` isn't a great variable name -- don't
                // hesitate to change the variable names to add clarity to what the variables represent! Pseudocode 
                // is more a mathematical reference than something to directly translate to code. (-0.5)
                double v = Double.MIN_VALUE;
                for (Map.Entry<T3Action, T3State> child: moves.entrySet()) {
                    v = Double.max(v, alphaBeta(child.getValue(), alpha, beta, false).mmScore);
                    alpha = Double.max(alpha, v);
                    if (beta <= alpha) break;
                }    
                // >> [LN] Whoops, looks like indentation is off here
                    kid.mmScore = v;
                    return kid;
            }
            
            else {
                Tuple kid = new Tuple(move.getKey(), 0.5);
                double v = Double.MAX_VALUE;
                for (Map.Entry<T3Action, T3State> child: moves.entrySet()) {
                    v = Double.min(v, alphaBeta(child.getValue(), alpha, beta, true).mmScore);
                    beta = Double.min(beta, v);
                    if (beta <= alpha) break;
                }
                    kid.mmScore = v;
                    return kid;
            }
        }
        return null;
    }
    
    // >> [LN] I like that you made your own tuple helper class, but next time think about
    // giving it a name that's perhaps a little bit more readable/illustrative of its purpose,
    // like MinimaxActionScore or something.
    private class Tuple{
        
        T3Action action;
        double mmScore;
        
        // >> [LN] Remember that *all* methods/constructors, helper or otherwise, need proper 
        // documentation with Javadoc syntax. (-1)
        Tuple(T3Action action, double mmScore) {
            this.action = action;
            this.mmScore = mmScore;
        }
    }
}


// =======================================================
// >>> [LN] Summary
// -------------------------------------------------------
// Correctness:         50.0 / 100 (-2.5pts / missed test)
// Style Penalty:       -2.5
// Total:               47.5 / 100
// -------------------------------------------------------
// A solid submission with a lot of good aspects that 
// unfortunately looks like you weren't able to test as 
// adequately as you needed to in order to reveal some 
// pesky bugs. Your code is organized and looks more or 
// less like the pseudocode, but without sufficient testing,
// it seems that you missed some important bugs, and all 
// the grading tests resulted in NullPointerExceptions. For
// next time, keep in mind that pseudocode is only for 
// your reference, and shouldn't be translated directly
// to exact lines of code! You're still responsible for 
// testing it on your own. 
// Stylistically, you've done a good job staying consistent
// for the most part, and I like that you made a helper
// class to store the action and score, but there's room
// for improvement with things like avoiding repetition and 
// including thorough documentation. 
// Next time, make sure to write lots of tests and give
// yourself adequate time to debug so that you can catch 
// all those pesky bugs, and you'll do great! Keep it up.
// =======================================================