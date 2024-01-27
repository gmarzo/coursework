package main.forneymon.arena;

import main.forneymon.fmtypes.Forneymon;

/**
 * Contains methods for facing off Forneymonagerie against one another!
 */
public class ForneymonArena {
    
    public static final int BASE_DAMAGE = 5;
    
    /**
     * Conducts a fight between two Forneymonageries, consisting of the following
     * steps:
     * <ol>
     *   <li>Forneymon from each Forneymonagerie are paired to fight, in sequence
     *     starting from index 0.</li>
     *  <li>Forneymon that faint (have 0 or less health) are removed from their
     *    respective Forneymonagerie.</li>
     *  <li>Repeat until one or both Forneymonagerie have no remaining Forneymon.</li>     
     * </ol>
     * @param fm1 One of the fighting Forneymonagerie
     * @param fm2 One of the fighting Forneymonagerie
     */
    public static void fight (Forneymonagerie fm1, Forneymonagerie fm2) {
        // TODO!
        int fc1 = 0;
        int fc2 = 0;
        boolean fc1fntd = false;
        boolean fc2fntd = false;
        while (!fm1.empty() && !fm2.empty()) {
            if (fc1 >= fm1.size()) fc1 = 0;
            if (fc2 >= fm2.size()) fc2 = 0;
            if (fc1fntd) {
                fc1--;
                fc1fntd = false;
                if (fc1 < 0) fc1 = fm1.size() - 1; 
            }
            if (fc2fntd) {
                fc2--;
                fc2fntd = false;
                if (fc2 < 0) fc2 = fm2.size() - 1;
            }
            fm1.get(fc1).takeDamage(BASE_DAMAGE + (fm2.get(fc2).getLevel()), fm2.get(fc2).getDamageType());
            fm2.get(fc2).takeDamage(BASE_DAMAGE + (fm1.get(fc1).getLevel()), fm1.get(fc1).getDamageType());
            if (fm1.get(fc1).getHealth() <= 0) {
                fm1.remove(fc1);
                fc1fntd = true;
            }
            if (fm2.get(fc2).getHealth() <= 0) {
                fm2.remove(fc2);
                fc2fntd = true;
            }
            fc1++;
            fc2++;
        }
    }
    
}
