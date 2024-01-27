/*
 * Project: ForneymonCard
 * Authors: Garrett Marzo, Jennifer Siao, and Ryan Nguyen
 * Due Date: 9/21/2020 
 */

package forneymon.cards;

import java.util.Objects;

public class ForneymonCard {

	public String subjectName;
	public String subjectType;
    /**
     * Creates a new ForneymonCard with a reference to the given
     * Forneymon
     * @param forneymon The Forneymon referenced by the card
     */
    ForneymonCard (Forneymon forneymon) {
    	if (forneymon == null) throw new IllegalArgumentException();
    	this.subjectName = forneymon.getName();
    	this.subjectType = forneymon.getClass().getSimpleName();
    }

    /**
     * Default constructor to create a new ForneymonCard of type
     * Burnymon with name "MissingNu"
     */
    ForneymonCard () {
    	Burnymon MissingNu = new Burnymon("MissingNu");
    	ForneymonCard MissingNuCard = new ForneymonCard(MissingNu);
    	this.subjectName = MissingNuCard.getName();
    	this.subjectType = MissingNuCard.getType();
    }

    /**
     * Getter for the name given to the Forneymon represented by
     * this card
     * @return The card's Forneymon's name, e.g., "Burny"
     */
    String getName () {
    	return subjectName;
    }

    /**
     * Getter for the type of the Forneymon represented by this
     * card
     * @return The card's Forneymon's type, e.g., "Dampymon"
     */
    String getType () {
        return subjectType;
    }
    
    @Override
    public int hashCode () {
        return Objects.hash(this.subjectName);
    }

}
