package main.spellex;

import java.util.*;

public class SpellEx {
    
    // Note: Not quite as space-conscious as a Bloom Filter,
    // nor a Trie, but since those aren't in the JCF, this map 
    // will get the job done for simplicity of the assignment
    private Map<String, Integer> dict;
    
    // For your convenience, you might need this array of the
    // alphabet's letters for a method
    private static final char[] LETTERS = "abcdefghijklmnopqrstuvwxyz".toCharArray();

    /**
     * Constructs a new SpellEx spelling corrector from a given
     * "dictionary" of words mapped to their frequencies found
     * in some corpus (with the higher counts being the more
     * prevalent, and thus, the more likely to be suggested)
     * @param words The map of words to their frequencies
     */
    public SpellEx(Map<String, Integer> words) {
        dict = new HashMap<>(words);
    }
    
    /**
     * Returns the edit distance between the two input Strings
     * s0 and s1 based on the minimal number of insertions, deletions,
     * replacements, and transpositions required to transform s0
     * into s1
     * @param s0 A "start" String
     * @param s1 A "destination" String
     * @return The minimal edit distance between s0 and s1
     */
    public static int editDistance (String s0, String s1) {
        
        if (s0.length() == 0) {
            return s1.length();
        }
        if (s1.length() == 0) {
            return s0.length();
        }
        
        int[][] t = new int[s0.length() + 1][s1.length() + 1];
        // >> [MT] Actually don't need to convert to charArray here, simply use the 
        // charAt method from the String class!
        char[] rowString = s0.toCharArray();
        char[] colString = s1.toCharArray();
        
        for (int i = 0; i <= s0.length(); i++) {
            t[i][0] = i;
        }
        for (int i = 0; i <= s1.length(); i++) {
            t[0][i] = i;
        }
        
        for (int r = 1; r <= s0.length(); r++) {
            for (int c = 1; c <= s1.length(); c++) {
                if (s0.substring(0, r).equals(s1.substring(0, c))) {
                    // >> [MT] Some optimization: Instead of using all these Math.min to keep track of
                    // the lowest editDistance thus far, use an ArrayList to store any valid operation's
                    // edit distance, and then get the minimum element in the ArrayList with Collections.min!
                    t[r][c] = Math.min(t[r-1][c], t[r][c-1]);
                    t[r][c] = Math.min(t[r][c], t[r-1][c-1]);
                    if (r >= 2 && c >= 2 && rowString[r-1] == colString[c-2] && rowString[r-2] == colString[c-1]) {
                        t[r][c] = Math.min(t[r][c], t[r-2][c-2]);
                    }
                } else {
                    // >> [MT] Uh oh note all the repeated logic here, can definitely combine these
                    // instead of having them as separate code blocks! (-0.5)
                    t[r][c] = Math.min(t[r-1][c], t[r][c-1]);
                    if (rowString[r-1] == colString[c-1]) {
                        if(t[r-1][c-1] < t[r][c]) {
                            t[r][c] = t[r-1][c-1];
                            continue;
                        }
                    }
                    t[r][c] = Math.min(t[r][c], t[r-1][c-1]);
                    if (r >= 2 && c >= 2 && rowString[r-1] == colString[c-2] && rowString[r-2] == colString[c-1]) {
                        t[r][c] = Math.min(t[r][c], t[r-2][c-2]);
                    }
                    t[r][c]++;
                }
            }
        }
        return t[s0.length()][s1.length()];
    }
    
    /**
     * Returns the n closest words in the dictionary to the given word,
     * where "closest" is defined by:
     * <ul>
     *   <li>Minimal edit distance (with ties broken by:)</li>
     *   <li>Largest count / frequency in the dictionary (with ties broken by:)</li>
     *   <li>Ascending alphabetic order</li>
     * </ul>
     * @param word The word we are comparing against the closest in the dictionary
     * @param n The number of least-distant suggestions desired
     * @return A set of up to n suggestions closest to the given word
     */
    public Set<String> getNLeastDistant (String word, int n) {
        
        PriorityQueue<Tuple> tq= new PriorityQueue<Tuple>(n, new TupleComparator());
        Set<String> closeWords = new HashSet<String>();
        
        for (String entry : dict.keySet()) {
            Tuple dictEntry = new Tuple(entry, editDistance(word, entry));
            tq.add(dictEntry);
        }
        
        for (Tuple entry : tq) {
            closeWords.add(entry.term);
        }
        
        return closeWords;
    }
    
    /**
     * Returns the set of n most frequent words in the dictionary to occur with
     * edit distance distMax or less compared to the given word. Ties in
     * max frequency are broken with ascending alphabetic order.
     * @param word The word to compare to those in the dictionary
     * @param n The number of suggested words to return
     * @param distMax The maximum edit distance (inclusive) that suggested / returned 
     * words from the dictionary can stray from the given word
     * @return The set of n suggested words from the dictionary with edit distance
     * distMax or less that have the highest frequency.
     */
    public Set<String> getNBestUnderDistance (String word, int n, int distMax) {
        throw new UnsupportedOperationException();
    }
    
    // >> [MT] Missing all your Javadoc here and below: (-1)
    private class Tuple{
        
        String term;
        int editDist;
        int freq;
        
        private Tuple(String term, int editDist) {
            this.term = term;
            this.editDist = 0;
            this.freq = dict.get(term);
            
        }
    }
    
    private class TupleComparator implements Comparator<Tuple>{
        // >> [MT] Rather than splitting into a Comparator and a custom utility class here,
        // simply have WordScore implement the Comparable interface and define its compareTo method
        
        public int compare(Tuple t1, Tuple t2) {
            // >> [MT] Note that comparators only expect that you return *some* number that is negative,
            // positive, or zero; you're not restricted to {-1, 0, 1}. Noting the above would allow you
            // to simply return the difference between these values and simplify the logic (-0.5)
            if (t1.editDist < t2.editDist)return 1;
            else if (t1.editDist > t2.editDist) return -1;
            
            if (t1.freq > t2.freq) return 1;
            else if (t1.freq < t2.freq) return -1;
            
            for (int i = 0; i < t1.term.length(); i++) {
                if (t1.term.charAt(i) < t2.term.charAt(i)) return 1;
                else if (t2.term.charAt(i) > t2.term.charAt(i)) return -1;
            }
            return 0;
        }
    }
}


// ===================================================
// >>> [MT] Summary
// ---------------------------------------------------
// Correctness:         45 / 100
// Style Penalty:       -2
// Total:               43 / 100
// ---------------------------------------------------
// Unfortunately, it appears that you ran out of time
// on this assignment and so did not get to complete
// getNBestUnderDistance and to test your solution
// comprehensively. Style-wise, your code in 
// getNLeastDistant is actually really clean and concise!
// No global comments here other than the notes I left
// above, just make sure to give yourself more time for
// the next assignment, and good luck!
// ===================================================