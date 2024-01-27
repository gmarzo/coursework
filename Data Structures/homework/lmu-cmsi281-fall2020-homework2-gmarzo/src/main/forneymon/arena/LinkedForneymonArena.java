package main.forneymon.arena;

import main.forneymon.fmtypes.Forneymon;

/**
 * Contains methods for facing off LinkedForneymonagerie against one another!
 */
public class LinkedForneymonArena {
    
    public static final int BASE_DAMAGE = 5;
    
    /**
     * Conducts a fight between two LinkedForneymonagerie, consisting of the following
     * steps, assisted by Iterators on each LinkedForneymonagerie:
     * <ol>
     *   <li>Forneymon from each LinkedForneymonagerie are paired to fight, in sequence
     *     starting from index 0.</li>
     *  <li>Forneymon that faint (have 0 or less health) are removed from their
     *    respective LinkedForneymonagerie.</li>
     *  <li>Repeat until one or both Forneymonagerie have no remaining Forneymon.</li>     
     * </ol>
     * @param fm1 One of the fighting LinkedForneymonagerie
     * @param fm2 One of the fighting LinkedForneymonagerie
     */
    public static void fight (LinkedForneymonagerie fm1, LinkedForneymonagerie fm2) {
        // [!] Recall: you are NOT allowed to use the LinkedForneymonagerie get method
        // in your implementation -- use your Iterators to conduct the fights instead!
        var it1 = fm1.getIterator();
        var it2 = fm2.getIterator();
        
        while (!fm1.empty() && !fm2.empty()) {
            it1.getCurrent().takeDamage(BASE_DAMAGE + it2.getCurrent().getLevel(), it2.getCurrent().getDamageType());
            it2.getCurrent().takeDamage(BASE_DAMAGE + it1.getCurrent().getLevel(), it1.getCurrent().getDamageType());
            if (it1.getCurrent().getHealth() <= 0) it1.removeCurrent();
            if (it2.getCurrent().getHealth() <= 0) it2.removeCurrent();
            it1.next();
            it2.next();
        }
     
    }
    
}
