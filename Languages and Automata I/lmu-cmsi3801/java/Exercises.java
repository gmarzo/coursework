import java.util.ArrayList;
// import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

public class Exercises {
    // Toal wrote this \/
    public static List<Integer> change(int amount) {
        if (amount < 0) {
            throw new IllegalArgumentException("Amount cannot be negative");
        }
        var coins = new ArrayList<Integer>();
        for (var coin : List.of(25, 10, 5, 1)) {
            coins.add(amount / coin);
            amount %= coin;
        }
        return List.copyOf(coins);
    }

    public static String stretched(String s) {
        List<String> result = s.replaceAll("[\\s\\t\\n ]", "").codePoints().mapToObj(Character::toString).collect(Collectors.toList());
        /* Huh? What in the world does this ^ do?
        1) s.replaceAll("[\\s\\t\\n ]", "") replaces all whitespaces with ""
            1.5) \\s means spaces, \\t means tabs, \\n means new lines
        2) .codePoints() returns the IntSream code / ASCII value of the characters (ie emojis) that are in the String
        3) .mapToObj(Character::toString) maps all of the ASCII values into Strings
        4) .collect(Collectors.toList()) collects all of those Strings and puts them into a list
        */
        
        var answer = "";
        var repeatCount = 1;

        for (var c : result) {
            answer = answer.concat(c.repeat(repeatCount));
            repeatCount++;
        }
        // tried using result.forEach(...) here, couldn't get around the enclosing scope of answer and repeatCount
        return answer;
    }

    public static IntStream powers(int base) {
        var powers = IntStream.iterate(1, i -> i * base);
        return powers;
    }
    	
		
    record Phrase(String word){
		String ok(){
			return word;
		}

		Phrase and(String s){
			return new Phrase(word + " " + s);
		}
	}

    public static String say() {
        return "";
    }
    
    public static Phrase say(String s){
		return new Phrase(s);
	}
		

    public static Optional<String> findFirstThenLower(Predicate<String> p, List<String> strings) {
        
        return strings.stream().filter(p).findFirst().map(letter -> letter.toLowerCase());
    }


    public static List<String> topTenScorers(Map<String, List<String>> data) {
        return null;
    }
}


