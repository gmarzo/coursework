package senttools;

import java.util.*;
/**
 * Simple library which might (outside of this assignment) contain
 * various functions related to some sentence tools.
 */
public class SentTools {

    /**
     * Returns the number of unique, unrepeated words that are found
     * in the given sentence sent
     * NOTE: This solution is not very good!!! It can be simplified
     * by using ArrayLists, but even those aren't the best choice here!
     * @param sent The sentence in which to count unique words
     * @return The number of unique, unrepeated words in sent
     */
    public static int uniqueWords (String sent) {
        
        String[] words = sent.split(" ");
        int unique = 0;
        HashMap<String, Boolean> supermarket = new HashMap<String, Boolean>();
        
        for (int i = 0; i < words.length; i++) {
            if (words[i].equals("")) continue;
            if (supermarket.containsKey(words[i])) {
                if (supermarket.get(words[i]) == false) continue;
                
                supermarket.replace(words[i], false);
                unique--;
            } else {
                supermarket.put(words[i], true);
                unique++;
            }
        }
        return unique;
    }
}