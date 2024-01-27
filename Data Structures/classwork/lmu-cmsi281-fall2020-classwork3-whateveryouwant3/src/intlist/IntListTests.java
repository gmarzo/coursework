package intlist;

import static org.junit.Assert.*;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

public class IntListTests {

    // =================================================
    // Test Configuration
    // =================================================

    // Global timeout to prevent infinite loops from
    // crashing the test suite
    @Rule
    public Timeout globalTimeout = Timeout.seconds(2);
    
    // Each time you pass a test, you get a point! Yay!
    // [!] Requires JUnit 4+ to run
    @Rule
    public TestWatcher watchman = new TestWatcher() {
        @Override
        protected void succeeded(Description description) {
            passed++;
        }
    };

    // Used as the basic empty Autocompleter to test;
    // the @Before method is run before every @Test
    IntArrayList arr;

    @Before
    public void init() {
        possible++;
        arr = new IntArrayList();
    }

    // Used for grading, reports the total number of tests
    // passed over the total possible
    static int possible = 0, passed = 0;

    @AfterClass
    public static void gradeReport() {
        System.out.println("\n============================");
        System.out.println("Tests Complete");
        System.out.println("* " + passed + " / " + possible + " passed!");
        if ((1.0 * passed / possible) >= 0.9) {
            System.out.println("* [!] Nice job!"); // Automated acclaim!
        }
        System.out.println("============================");
    }

    // =================================================
    // Unit Tests
    // =================================================

    // Initialization Tests
    // -------------------------------------------------
    @Test
    public void testIntList() {
        arr.append(1);
        arr.append(2);
        arr.append(3);
        arr.append(4);
        arr.getAt(0);
        arr.getAt(1);
    }

    // Basic Tests
    // -------------------------------------------------
    @Test
    public void prependTest() {
        arr.prepend(3);
        assertEquals(1, arr.size());
        assertEquals(3, arr.getAt(0));
        arr.prepend(5);
        assertEquals(5, arr.getAt(0));
    }
    
    @Test
    public void insertAtTest() {
        arr.insertAt(1, 3);
        assertEquals(1, arr.getAt(3));
        arr.insertAt(2, 3);
        assertEquals(1, arr.getAt(4));
        assertEquals(2, arr.getAt(3));
    }
    
    @Test
    public void removeAllTest() {
        arr.prepend(8);
        arr.prepend(4);
        arr.prepend(3);
        arr.prepend(4);
        arr.prepend(5);
        arr.removeAll(4);
        assertEquals(3, arr.getAt(1));
        assertEquals(3, arr.size());
    }
}
