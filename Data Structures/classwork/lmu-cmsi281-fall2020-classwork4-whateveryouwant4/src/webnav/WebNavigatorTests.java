package webnav;

import static org.junit.Assert.*;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

public class WebNavigatorTests {
    
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
    WebNavigator navi;
    
    // The @Before method is run before every @Test
    @Before
    public void init () {
        navi = new WebNavigator();
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

    @Test
    public void webNavTest_t0() {
        assertEquals(null, navi.getCurrent());
        navi.visit("www.google.com");
        assertEquals("www.google.com", navi.getCurrent());
        navi.visit("www.reddit.com");
        assertEquals("www.reddit.com", navi.getCurrent());
        navi.back();
        assertEquals("www.google.com", navi.getCurrent());
        navi.back();
        assertEquals("www.google.com", navi.getCurrent());
        navi.forw();
        assertEquals("www.reddit.com", navi.getCurrent());
        navi.forw();
        assertEquals("www.reddit.com", navi.getCurrent());
        navi.visit("www.facebook.com");
        assertEquals("www.facebook.com", navi.getCurrent());
        navi.back();
        assertEquals("www.reddit.com", navi.getCurrent());
        
        // Visiting another site after moving back wipes
        // the "forward" collection
        navi.visit("www.amazon.com");
        assertEquals("www.amazon.com", navi.getCurrent());
        
        // See? doesn't go back to reddit
        navi.forw();
        assertEquals("www.amazon.com", navi.getCurrent());
        // www.amazon.com    
    }
    
}
