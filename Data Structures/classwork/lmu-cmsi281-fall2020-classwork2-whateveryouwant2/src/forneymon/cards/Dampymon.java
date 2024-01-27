package forneymon.cards;

/**
 * Dampymon annoy their opponents by soaking them, and are heartier
 * than the typical Forneymon
 */
public class Dampymon extends Forneymon implements MinForneymon {
    
    private static final int STARTING_HEALTH = 25,
                             BURNING_DMG_BONUS = 5;
    
    /**
     * Creates a new Dampymon with the given name n.
     * Starts with 25 health.
     * @param n The Dampymon's given name
     */
    Dampymon (String n) {
        super(STARTING_HEALTH, n);
    }
    
    /**
     * Unlike the typical Forneymon, Dampymon take an additional
     * 5 damage if the type is burny
     */
    @Override
    public int takeDamage (int dmg, String type) {
        if (type.equals("burny")) {
            dmg += BURNING_DMG_BONUS;
        }
        return super.takeDamage(dmg, type);
    }
    
}
