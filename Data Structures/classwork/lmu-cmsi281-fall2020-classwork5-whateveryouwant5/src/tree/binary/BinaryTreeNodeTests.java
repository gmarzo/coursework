package tree.binary;

import static org.junit.Assert.*;

import org.junit.AfterClass;
import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.rules.TestWatcher;
import org.junit.rules.Timeout;
import org.junit.runner.Description;

public class BinaryTreeNodeTests {
    
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

    @Test
    public void testDoubleTree() {
        BinaryTreeNode t1 = new BinaryTreeNode("A");
        BinaryTreeNode sln = new BinaryTreeNode("A");
        sln.left = new BinaryTreeNode("A");
        
        t1.doubleTree();
        assertTrue(t1.treequal(sln));
        
        t1 = new BinaryTreeNode("A");
        t1.left = new BinaryTreeNode("B");
        t1.doubleTree();
        BinaryTreeNode addingTo = sln.left;
        addingTo.left = new BinaryTreeNode("B");
        addingTo = addingTo.left;
        addingTo.left = new BinaryTreeNode("B");
        assertTrue(t1.treequal(sln));
        
        t1 = new BinaryTreeNode("A");
        t1.left = new BinaryTreeNode("B");
        t1.right = new BinaryTreeNode("C");
        t1.doubleTree();
        sln.right = new BinaryTreeNode("C");
        sln.right.left = new BinaryTreeNode("C");
        assertTrue(t1.treequal(sln));
        
        t1 = new BinaryTreeNode("A");
        t1.left = new BinaryTreeNode("B");
        t1.right = new BinaryTreeNode("C");
        t1.right.left = new BinaryTreeNode("D");
        t1.doubleTree();
        addingTo = sln.right.left;
        addingTo.left = new BinaryTreeNode("D");
        addingTo = addingTo.left;
        addingTo.left = new BinaryTreeNode("D");
        assertTrue(t1.treequal(sln));
    }
    
    @Test
    public void testLevels() {
        BinaryTreeNode t1 = new BinaryTreeNode("A");
        assertEquals(1, t1.levels());
        t1.left = new BinaryTreeNode("B");
        assertEquals(2, t1.levels());
        t1.right = new BinaryTreeNode("C");
        assertEquals(2, t1.levels());
        BinaryTreeNode ref = t1.left;
        ref.right = new BinaryTreeNode("D");
        assertEquals(3, t1.levels());
        ref = ref.right;
        ref.left = new BinaryTreeNode("E");
        assertEquals(4, t1.levels());
    }

}
