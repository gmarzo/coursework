package main.textfill;

import java.util.*;

/**
 * A ternary-search-tree implementation of a text-autocompletion
 * trie, a simplified version of some autocomplete software.
 * @author Garrett Marzo
 */
public class TernaryTreeTextFiller implements TextFiller {

    // -----------------------------------------------------------
    // Fields
    // -----------------------------------------------------------
    private TTNode root;
    private int size;
    
    // -----------------------------------------------------------
    // Constructor
    // -----------------------------------------------------------
    public TernaryTreeTextFiller () {
        this.root = null;
        this.size = 0;
    }
    
    
    // -----------------------------------------------------------
    // Methods
    // -----------------------------------------------------------
    
    /**
     * Returns an int representing the number of "terms" stored.
     * Essentially the number of word ends
     * @return the number of terms stored within.
     */
    public int size () {
        return this.size;
    }
    
    /**
     * Returns T/F representing if the filler is empty, it has no stored terms.
     * @return Whether the number of terms is 0 or not.
     */
    public boolean empty () {
        return this.size == 0;
    }
    
    // >> [AF] Oh no! No documentation, make sure you leave time to
    // adequately document all of your methods, it's a good place to start
    // for any assignment since it gives you an outline of what to do! (-3)
    public void add (String toAdd) {
        //if (contains(toAdd)) return; 
        this.root = this.addWord(this.root, toAdd, 0);
    }
    
    public boolean contains (String query) {
        return this.contains(this.root, normalizeTerm(query), 0);
    }
    
    public String textFill (String query) {
        throw new UnsupportedOperationException();
    }
    
    public List<String> getSortedList () {
        throw new UnsupportedOperationException();
    }
    
    
    // -----------------------------------------------------------
    // Helper Methods
    // -----------------------------------------------------------
    
    /**
     * Normalizes a term to either add or search for in the tree,
     * since we do not want to allow the addition of either null or
     * empty strings within, including empty spaces at the beginning
     * or end of the string (spaces in the middle are fine, as they
     * allow our tree to also store multi-word phrases).
     * @param s The string to sanitize
     * @return The sanitized version of s
     */
    private String normalizeTerm (String s) {
        // Edge case handling: empty Strings illegal
        if (s == null || s.equals("")) {
            throw new IllegalArgumentException();
        }
        return s.trim().toLowerCase();
    }
    
    /**
     * Given two characters, c1 and c2, determines whether c1 is
     * alphabetically less than, greater than, or equal to c2
     * @param c1 The first character
     * @param c2 The second character
     * @return
     *   - some int less than 0 if c1 is alphabetically less than c2
     *   - 0 if c1 is equal to c2
     *   - some int greater than 0 if c1 is alphabetically greater than c2
     */
    private int compareChars (char c1, char c2) {
        return Character.toLowerCase(c1) - Character.toLowerCase(c2);
    }
    
    // [!] Add your own helper methods here!
    
    // >> [AF] Need to document what your helper methods do / expect as input as well!
    private TTNode addWord (TTNode start, String toAdd, int index) {
        
        if (index == toAdd.length()) {
            return new TTNode(toAdd.charAt(index - 1), true);
        }
        
        TTNode addLetter = new TTNode(toAdd.charAt(index), false);
        
        if (this.root == null) {
            this.root = addLetter;
            this.root.mid = addWord(this.root.mid, toAdd, index + 1);
        }
        if (start == null) {
            start = addLetter;
           return addWord(start.mid, toAdd, index + 1);
        }
        
        if (compareChars(start.letter, addLetter.letter) > 0) {
            start.left = addWord(start.left, toAdd, index);
        } else if (compareChars(start.letter, addLetter.letter) < 0){
            start.right = addWord(start.right, toAdd, index);
        } else {
            start.mid = addWord(start.mid, toAdd, index + 1);
        }
        this.size++;
        return start;
    }
    
    private boolean contains(TTNode start, String query, int index) {
        
        TTNode current = start;
        if (index == query.length() - 1 && current.wordEnd) return true;
        if (current == null) return false;
        
        if (compareChars(current.letter, query.charAt(index)) == 0) {
            contains(current.mid, query, index + 1);
        }
        if (compareChars(current.letter, query.charAt(index)) > 0) {
            contains(current.left, query, index);
        }
        if (compareChars(current.letter, query.charAt(index)) < 0) {
            contains(current.right, query, index);
        }
        return false;
    }
    
    // -----------------------------------------------------------
    // Extra Credit Methods
    // -----------------------------------------------------------
    
    public void add (String toAdd, int priority) {
        throw new UnsupportedOperationException();
    }
    
    public String textFillPremium (String query) {
        throw new UnsupportedOperationException();
    }
    
    
    // -----------------------------------------------------------
    // TTNode Internal Storage
    // -----------------------------------------------------------
    
    /**
     * Internal storage of autocompleter search terms
     * as represented using a Ternary Tree with TTNodes
     */
    private class TTNode {
        
        boolean wordEnd;
        char letter;
        TTNode left, mid, right;
        
        /**
         * Constructs a new TTNode containing the given character
         * and whether or not it represents a word-end, which can
         * then be added to the existing tree.
         * @param c Letter to store at this node
         * @param w Whether or not this is a word-end
         */
        TTNode (char c, boolean w) {
            letter  = c;
            wordEnd = w;
        }
        
    }
    
}
// ===================================================
// >>> [AF] Summary
// ---------------------------------------------------
// Correctness:         35.5 / 100 (-1.5pts / missed test)
// Style Penalty:       -3
// Total:               32.5 / 100
// ---------------------------------------------------
// A sad tale here my friend, because stylistically
// there was a lot to like -- good delegation of tasks to 
// helper methods, and solid logic throughout... unfortunately, 
// it looks like you ran out of time, especially for
// testing, as there were quite a few bugs that prevented
// the proper functionality of what you did have. As programmers,
// we only get to be as confident in our code as the
// thoroughness of the tests we subject it to, and if we
// don't, things just don't work. Of course, a big part of
// that is giving yourself the time to even have an implementation
// to test, so make sure you're starting these assignments
// with plenty of time to develop incrementally and ask questions
// in the future.
// ===================================================
