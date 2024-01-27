package forneymon.cards;

import static org.junit.Assert.*;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

public class ForneymonCardTests {
    
    // =================================================
    // Test Configuration
    // =================================================
    
    // Global timeout to prevent infinite loops from
    // crashing the test suite
    @Rule
    public Timeout globalTimeout = Timeout.seconds(1);
    
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
    // Test objects that are re-instantiated before each test
    Burnymon b1, b2, b3;
    Dampymon d1, d2, d3;
    
    // The @Before mmethod is run before every @Test
    @Before
    public void init () {
        b1 = new Burnymon("Burny");
        b2 = new Burnymon("Burny");
        b3 = new Burnymon("Scald");
        d1 = new Dampymon("Dampy");
        d2 = new Dampymon("Dampy");
        d3 = new Dampymon("Soggy");
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
    public void constructionTest_t0() {
        ForneymonCard f1 = new ForneymonCard(b1);
        assertEquals("Burny", f1.getName());
        assertEquals("Burnymon", f1.getType());
        ForneymonCard f2 = new ForneymonCard();
        assertEquals("MissingNu", f2.getName());
        assertEquals("Burnymon", f2.getType());
    }
    
    @Test
    public void constructionTest_t1() {
        FlippingForneymonCard f1 = new FlippingForneymonCard(b1, false);
        FlippingForneymonCard f2 = new FlippingForneymonCard();
        assertEquals("Burnymon: Burny", f1.toString());
        assertEquals("Burny", f1.getName());
        assertEquals("Burnymon", f1.getType());
        assertEquals("?: ?", f2.toString());
        assertEquals("MissingNu", f2.getName());
        assertEquals("Burnymon", f2.getType());
    }
    
    @Test
    public void flippingTest_t0() {
        FlippingForneymonCard f1 = new FlippingForneymonCard(b1, false);
        FlippingForneymonCard f2 = new FlippingForneymonCard(b2, false);
        FlippingForneymonCard f3 = new FlippingForneymonCard(b3, false);
        assertEquals("Burnymon: Burny", f1.toString());
        assertEquals(1, f1.match(f2));
        assertEquals(0, f1.match(f3));
        assertTrue(f1.equals(f2));
        assertFalse(f1.equals(f3));
        
        boolean faceDown = f1.flip();
        assertTrue(faceDown);
        assertEquals("?: ?", f1.toString());
        assertEquals(2, f1.match(f2));
        assertEquals(2, f1.match(f3));
        assertTrue(f1.equals(f2));
        assertFalse(f1.equals(f3));
    }

}
