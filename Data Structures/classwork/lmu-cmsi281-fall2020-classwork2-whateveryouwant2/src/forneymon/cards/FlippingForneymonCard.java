/*
 * Project: FlippingForneymonCard
 * Authors: Garrett Marzo, Jennifer Siao, and Ryan Nguyen
 * Due Date: 9/21/2020 
 */

package forneymon.cards;

public class FlippingForneymonCard extends ForneymonCard {

	private boolean faceDown;
	private Forneymon forneymon;
	private ForneymonCard card;
	
    /**
     * Creates a new FlippingForneymonCard with a reference to the given
     * Forneymon and whether or not it begins face-down
     * @param forneymon The Forneymon referenced by the card
     * @param f Whether or not the card begins face-down (false = face-down)
     */
    FlippingForneymonCard (Forneymon forneymon, boolean f) {
        if (forneymon == null) throw new IllegalArgumentException();
        this.forneymon = forneymon;
        this.card = new ForneymonCard(forneymon);
        this.faceDown = f;
        this.subjectName = card.getName();
        this.subjectType = card.getType();
    }
    
    /**
     * Default constructs a new FlippingForneymonCard that represents a
     * face-down Burnymon with name "MissingNu"
     */
    FlippingForneymonCard () {
    	Burnymon MissingNu = new Burnymon("MissingNu");
    	FlippingForneymonCard MissingNuFlip = new FlippingForneymonCard(MissingNu, true);
    	this.card = MissingNuFlip.card;
    	this.faceDown = MissingNuFlip.faceDown;
    }
    
    /**
     * Turns the card face-up if face-down and vice versa.
     * @return The current state of whether or not the card is face-down
     * after the flip
     */
    public boolean flip () {
        if (faceDown == true) {
        	faceDown = false;
        }
        else faceDown = true;
        return faceDown;
    }
    
    /**
     * Used to determine (by matching cardgame mechanics) whether or not
     * the given other FlippingForneymonCard is a match with the current one.
     * @param other The compared FlippingForneymonCard to this one
     * @return int code corresponding to:
     * <ol>
     *   <li>2 if either this or the other FlippingForneymonCard are face-down.</li>
     *   <li>1 if both are face-up and considered equal</li>
     *   <li>0 if both are face-up and considered unequal</li>
     * </ol>
     */
    int match (FlippingForneymonCard other) {
        if (faceDown == true || other.faceDown == true) return 2;
        if (this.forneymon.equals(other.forneymon)) return 1;
        return 0;
    }
    
    @Override
    public String toString() {
    	if (faceDown == true) return "?: ?";
    	return card.getType() + ": " + card.getName();
    }
    
    //fixes .equals error. don't need @Override
    public boolean equals (ForneymonCard other) {
        if (this.getClass() != other.getClass()) {
            return false;
        }
        return this.subjectName.equals(((ForneymonCard) other).subjectName);
    }
    
    
    
}
