package senttools;

import static org.junit.Assert.*;
import static senttools.SentTools.*;

import org.junit.*;
import org.junit.rules.Timeout;
import org.junit.runner.Description;
import org.junit.rules.TestWatcher;

public class SentToolTests {
    
    // =================================================
    // Test Configuration
    // =================================================
    
    // Global timeout to prevent infinite loops from
    // crashing the test suite
//    @Rule
//    public Timeout globalTimeout = Timeout.seconds(1);
    
    // Each time you pass a test, you get a point! Yay!
    // [!] Requires JUnit 4+ to run
    @Rule
    public TestWatcher watchman = new TestWatcher() {
        @Override
        protected void succeeded(Description description) {
            passed++;
        }
    };
    
    // Grade record-keeping
    static int possible = 0, passed = 0;
    
    // The @Before mmethod is run before every @Test
    @Before
    public void init () {
        possible++;
    }
    
    // Used for grading, reports the total number of tests
    // passed over the total possible
    @AfterClass
    public static void gradeReport () {
        System.out.println("============================");
        System.out.println("Tests Complete");
        System.out.println(passed + " / " + possible + " passed!");
        if ((1.0 * passed / possible) >= 0.9) {
            System.out.println("[!] Nice job!"); // Automated acclaim!
        }
        System.out.println("============================");
    }
    
    
    // =================================================
    // Unit Tests
    // =================================================
    // For grading purposes, every method and unit is 
    // weighted equally and totaled for the score.
    // The tests increase in difficulty such that the
    // basics are unlabeled and harder tiers are tagged
    // t0, t1, t2, t3, ... easier -> harder

    @Test
    public void uniqueWords_t0() {
        assertEquals(1, uniqueWords("hi"));
        assertEquals(2, uniqueWords("hi there"));
    }
    
    @Test
    public void uniqueWords_t1() {
        assertEquals(0, uniqueWords("hi hi"));
    }

    @Test
    public void uniqueWords_t2() {
        assertEquals(0, uniqueWords(""));
    }
    
    
    @Test
    public void uniqueWords_t3() {
        assertEquals(0, uniqueWords("test test this this sent sent"));
        assertEquals(2, uniqueWords("test this too test this tutu"));
    }
    
    @Test
    public void uniqueWords_t4() {
        assertEquals(0, uniqueWords("this has three three this has has three this"));
        assertEquals(2, uniqueWords("there are repeats two repeats are repeats"));
    }
    
}

