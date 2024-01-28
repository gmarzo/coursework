import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

public class ExercisesTest {

    @Test
    public void testChange() {
        assertThrows(IllegalArgumentException.class, () -> Exercises.change(-20));
        assertEquals(Exercises.change(0), List.of(0, 0, 0, 0));
        assertEquals(Exercises.change(1), List.of(0, 0, 0, 1));
        assertEquals(Exercises.change(13), List.of(0, 1, 0, 3));
        assertEquals(Exercises.change(50), List.of(2, 0, 0, 0));
        assertEquals(Exercises.change(5), List.of(0, 0, 1, 0));
        assertEquals(Exercises.change(397), List.of(15, 2, 0, 2));
        assertEquals(Exercises.change(42), List.of(1, 1, 1, 2));
        assertEquals(Exercises.change(1000000017), List.of(40000000, 1, 1, 2));
    }

    @Test
    public void testStretched() {
        assertEquals(Exercises.stretched(""), "");
        assertEquals(Exercises.stretched("  "), "");
        assertEquals(Exercises.stretched("  \t\n  \t"), "");
        assertEquals(Exercises.stretched("  Hi  hi  "), "Hiihhhiiii");
        assertEquals(Exercises.stretched("😁😂😱"), "😁😂😂😱😱😱");
        assertEquals(Exercises.stretched("hello world"), "heelllllllooooowwwwwwooooooorrrrrrrrllllllllldddddddddd");
    }

    @Test
    public void testPowersStream() {
        assertArrayEquals(Exercises.powers(1).limit(5).toArray(),
            new int[] { 1, 1, 1, 1, 1 });
        assertArrayEquals(Exercises.powers(7).limit(10).toArray(),
            new int[] { 1, 7, 49, 343, 2401, 16807, 117649, 823543, 5764801, 40353607 });
        assertArrayEquals(Exercises.powers(-3).limit(5).toArray(),
            new int[] { 1, -3, 9, -27, 81 });
        assertArrayEquals(Exercises.powers(10).limit(4).toArray(),
            new int[] { 1, 10, 100, 1000 });
    }

    @Test
    public void testSay() {
        assertEquals(Exercises.say("A").ok(), "A");
        assertEquals(Exercises.say(), "");
        assertEquals(Exercises.say("A").and("B").ok(), "A B");
        assertEquals(Exercises.say("🐤🦇").and("$🦊👏🏽").and("!").ok(), "🐤🦇 $🦊👏🏽 !");
    }

    @Test
    public void testFindFirstAndLowerCase() {
        assertEquals(
            Exercises.findFirstThenLower(s -> s.length() > 10, List.of()),
            Optional.empty()
        );
        assertEquals(
            Exercises.findFirstThenLower(s -> s.length() > 5, List.of("hello", "world")),
            Optional.empty()
        );
        assertEquals(
            Exercises.findFirstThenLower(s -> s.startsWith("HELL"), List.of("HELLO", "WORLD")),
            Optional.of("hello")
        );
        assertEquals(
            Exercises.findFirstThenLower(s -> s.contains("d!"), List.of("Hello", "World!!")),
            Optional.of("world!!")
        );
    }

    @Test
    public void testTopTenScorers() {
        assertEquals(Exercises.topTenScorers(Map.of()), List.of());

        assertEquals(
            Exercises.topTenScorers(Map.of("T1", List.of("A,30,300"))),
            List.of("A|10.00|T1")
        );

        var stats = new HashMap<String, List<String>>();
        stats.put("ATL", List.of(
            "Betnijah Laney,16,263", "Courtney Williams,14,193"));
        stats.put("CHI", List.of(
            "Kahleah Copper,17,267", "Allie Quigley,17,260", "Courtney Vandersloot,17,225"));
        stats.put("CONN", List.of(
            "DeWanna Bonner,16,285", "Alyssa Thomas,16,241"));
        stats.put("DAL", List.of(
            "Arike Ogunbowale,16,352", "Satou Sabally,12,153"));
        stats.put("IND", List.of(
            "Kelsey Mitchell,16,280", "Tiffany Mitchell,13,172", "Candice Dupree,16,202"));
        stats.put("LA", List.of(
            "Nneka Ogwumike,14,172", "Chelsea Gray,16,224", "Candace Parker,16,211"));
        stats.put("LV", List.of(
            "A’ja Wilson,15,304", "Dearica Hamby,15,188", "Angel McCoughtry,15,220"));
        stats.put("MIN", List.of(
            "Napheesa Collier,16,262", "Crystal Dangerfield,16,254"));
        stats.put("NY", List.of(
            "Layshia Clarendon,15,18"));
        stats.put("PHX", List.of(
            "Diana Taurasi,13,236", "Brittney Griner,12,212", "Skylar Diggins-Smith,16,261",
            "Bria Hartley,13,190"));
        stats.put("SEA", List.of(
            "Breanna Stewart,16,317", "Jewell Loyd,16,223"));
        stats.put("WSH", List.of(
            "Emma Meesseman,13,158", "Ariel Atkins,15,212", "Myisha Hines-Allen,15,236"));

        assertEquals(
            Exercises.topTenScorers(stats),
            List.of(
                "Arike Ogunbowale|22.00|DAL",
                "A’ja Wilson|20.27|LV",
                "Breanna Stewart|19.81|SEA",
                "DeWanna Bonner|17.81|CONN",
                "Kelsey Mitchell|17.50|IND",
                "Betnijah Laney|16.44|ATL",
                "Napheesa Collier|16.38|MIN",
                "Skylar Diggins-Smith|16.31|PHX",
                "Crystal Dangerfield|15.88|MIN",
                "Myisha Hines-Allen|15.73|WSH"
            )
        );
    }
}