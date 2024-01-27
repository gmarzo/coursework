package senttools;

/**
 * Simple library which might (outside of this assignment) contain
 * various functions related to some sentence tools.
 */
public class SentTools {

    /**
     * Returns the number of unique, unrepeated words that are found
     * in the given sentence sent
     * @param sent The sentence in which to count unique words
     * @return The number of unique, unrepeated words in sent
     */
	public static int uniqueWords(String sent) {

        // >>> [LN] Beware of mixing tabs and spaces! It's generally good
        // practice to use 4-space indents rather than tabs. This is 
        // something you can easily change in the settings of your code editor.

		String[] sentArray = sent.split(" ");
		int newWords = 0;
		boolean matches = false;
		
		if (sentArray.length == 1) return 1;
		
		for (int i = 0; i < sentArray.length; i++) {
			for (int j = 0; j < sentArray.length; j++) {
				if (j == i) continue;
				if (sentArray[i].equals(sentArray[j])) matches = true;
				if (matches == false) newWords++;
				matches = false;
			}
		}
		return newWords;
        
        // >>> [LN] Note: There's a data structure that can make it easy and 
        // clean to count up the number of times words appear in a sentence: 
        // a HashMap! You'll learn more about HashMaps this semester.

	}

}