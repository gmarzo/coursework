package main.forneymon.arena;

import java.util.Objects;

import main.forneymon.fmtypes.*;

/**
 * Collections of Forneymon ready to fight in the arena!
 */
public class Forneymonagerie implements ForneymonagerieInterface {

    // Constants
    // ----------------------------------------------------------
    // [!] DO NOT change this START_SIZE for your collection, and
    // your collection *must* be initialized to this size
    private static final int START_SIZE = 4;

    // Fields
    // ----------------------------------------------------------
    private Forneymon[] collection;
    private int size;
    
    
    // Constructor
    // ----------------------------------------------------------
    public Forneymonagerie () {
        // >> [AF] Remove any test / spec TODO comments before submitting!
        // TODO!
        this.collection = new Forneymon[START_SIZE];
        this.size = 0;
    }
    
    
    // Methods
    // ----------------------------------------------------------
    
    // TODO: Remember your documentation on these methods as well!
    /**
     * Returns a boolean on whether or not the given Forneymonagerie has no Forneymon within it.
     * @return if the Forneymonagerie is empty.
     */
    public boolean empty () {
        // TODO!
        // >> [AF] Can simplify logic here to just:
        // return this.size == 0;
        if (this.size == 0) return true;
        return false;
    }
    
    /**
     * Returns the number of Forneymon in a Forneymonagerie as an int.
     * @return size of the Forneymonagerie's collection.
     */
    public int size () {
        // TODO!
        return this.size;
    }
    
    /**
     * Adds a new Forneymon to the first open index with two exceptions.
     *  - The Forneymon to be added already has an identical Forneymon in the collection.
     *      This will do nothing and return false.
     *  - The Forneymon's type matches one already in the collection.
     *      This will increase the level of the existing Forneymon by toAdd's level.
     * @param toAdd The Forneymon to be potentially added to the array.
     * @return If a new Forneymon was added to the Forneymonagerie.
     */
    public boolean collect (Forneymon toAdd) {
        // TODO!
        // >> [AF] Note that you could have used the getTypeIndex method to see if something
        // of the same type already existed within (and then could check if it was the exact
        // same Forneymon or not)
        for (int i = 0; i < this.size; i++) {
            if (toAdd == this.collection[i]) return false;
            if (toAdd.getClass() == this.collection[i].getClass()) {
                this.collection[i].addLevels(toAdd.getLevel());
                return false;
            }
        }
        for (int i = 0; i < this.collection.length; i++) {
            if (this.collection[i] == null) {
                this.collection[i] = toAdd;
                this.size++;
                break;
            }
            
        }
        return true;
    }
    
    /**
     * Releases a Forneymon of a given type (if present) from the Forneymonagerie, and shifts everything accordingly.
     * @param fmType The type of Forneymon that is to be released.
     * @return a boolean as to whether a Forneymon was actually removed.
     */
    public boolean releaseType (String fmType) {
        // TODO!
        // >> [AF] Once is forgivable, but here you've missed another opportunity to use the
        // getTypeIndex method to reduce code repetition -- be aware of what methods exist
        // to make your life easier, and your code DRY! (-0.5)
        boolean deleted = false;
        // >> [AF] Ooo no you should not be creating a whole-new collection for a method like
        // releaseType -- this is very memory-intensive since you've now, unnecessarily, doubled
        // the memory requirements of your running program! Think instead about how we removed
        // ints in our simple IntArrayList from class (-1)
        Forneymon[] newMonagerie = new Forneymon[this.collection.length];
        int addSpot = 0;
        for (int i = 0; i < this.size; i++) {
            if (this.collection[i].getFMType().equals(fmType)) {
                deleted = true;
                continue;
            }
            newMonagerie[addSpot] = this.collection[i];
            addSpot++;
        }
        this.collection = newMonagerie;
        if (deleted) {
            this.size--;
            return true;
        }
        return false;
    }
    
    /**
     * Return a Forneymon at a given point in the collection.
     * @param index The index that the returned Forneymon is at.
     * @return The Forneymon at the given index.
     */
    public Forneymon get (int index) {
        // TODO!
        if (index >= this.size || index < 0) throw new IllegalArgumentException();
        return this.collection[index];
    }
    
    /**
     * Removes a Forneymon from the Forneymonagerie at the given index, and shifts everything accordingly.
     * @param index The index in the collection holding the Forneymon to be removed.
     * @return the Forneymon that is removed. 
     */
    public Forneymon remove (int index) {
        // TODO!
        if (index >= this.size || index < 0) throw new IllegalArgumentException();
        
        // >> [AF] Loooots of rampant code-repetition here -- see how this looks almost
        // exactly like your releaseType method? (-1)
        Forneymon[] newMonagerie = new Forneymon[collection.length];
        int addSpot = 0;
        Forneymon toReturn = this.collection[index];
        for (int i = 0; i < collection.length; i++) {
            if (i == index) {
                this.size--;
                continue;
            }
            newMonagerie[addSpot] = this.collection[i];
            addSpot++;
        }
        this.collection = newMonagerie;
        return toReturn;
    }
    
    /**
     * Returns the index of a Forneymon with a given type if present.
     * If it is not there, returns -1 instead.
     * @param fmType the fmType of the Forneymon being searched for.
     * @return either the index of the given Forneymon type, or -1 if not there.
     */
    public int getTypeIndex (String fmType) {
        // TODO!
        for (int i = 0; i < this.size; i++) {
            if (this.collection[i].getFMType().equals(fmType)) return i;
        }
        return -1;
    }
    
    /**
     * Checks the Forneymonagerie if it has a Forneymon of a given type within.
     * @param toCheck The type of Forneymon to be checked.
     * @return boolean on whether the Forneymonagerie contains a Forneymon
     * of the given type.
     */
    public boolean containsType (String toCheck) {
        // TODO!
        // >> [AF] See how your containsType and getTypeIndex methods look almost exactly alike?
        // Time to think about abstracting their commonalities! You could really just call one
        // inside of the other... (-0.5)
        for (int i = 0; i < this.size; i++) {
            if (collection[i].getFMType().equals(toCheck)) return true;
        }
        return false;
    }
    
    /**
     * Trades all of the Forneymon within 2 Forneymonageries between each other.
     * @param other The Forneymonagerie to be traded with the first.
     */
    public void trade (Forneymonagerie other) {
        // TODO!
        Forneymon[] hold = this.collection;
        int sizeHold = this.size;
        this.collection = other.collection;
        other.collection = hold;
        this.size = other.size;
        other.size = sizeHold;
    }
    
    /**
     * Moves a Forneymon of a given type to another index within the Forneymonagerie,
     * and shifts everything else accordingly.
     * @param fmType the type of Forneymon to be moved.
     * @param index the index that the Forneymon in the array is to be moved to.
     */
    public void rearrange (String fmType, int index) {
        // TODO!
        Forneymon toArrange = null;
        if (index < 0 || index >= size - 1) throw new IllegalArgumentException();
        // >> [AF] A bit complex of logic below -- at this point, might be time to take a step
        // back, head to the drawing-board, and consider what tools are at your disposal
        for (int i = 0; i < collection.length; i++) {
            if (fmType.equals(this.collection[i].getFMType())) {
                toArrange = this.collection[i];
                for (int j = this.size - 2; j >= index; j--) {
                    this.collection[j + 1] = this.collection[j];
                }
                collection[index] = toArrange;
                break;
            }
        }
        return;
    }
    
    /**
     * Override method
     * Creates a new Forneymonagerie with identical Forneymon to the first.
     * @return The new "deep copy" of the Forneymonagerie.
     */
    @Override
    public Forneymonagerie clone () {
        // TODO!
        Forneymonagerie clone = new Forneymonagerie();
        for (int i = 0; i < this.size; i++) {
            clone.collection[i] = this.collection[i].clone();
        }
        clone.size = this.size;
        return clone;
    }
    
    /**
     * Override method
     * Determines if two Forneymonagerie have the same number and type of Forneymon within it.
     * @return boolean whether the two Forneymonageries match.
     */
    @Override
    public boolean equals (Object other) {
        // TODO!
        if (this.size != ((Forneymonagerie)other).size) return false;
        for (int i = 0; i < this.size; i++) {
            if (!(this.collection[i].equals(((Forneymonagerie)other).collection[i]))) {
                return false;
            }
        }
        return true;
    }
    
    @Override
    public int hashCode () {
        // This one is a freebie, no changes necessary here
        return Objects.hash(this.collection, this.size);
    }
    
    @Override
    public String toString () {
        // This one's also freebie -- you don't have to add or
        // change anything here!
        String[] result = new String[size];
        for (int i = 0; i < size; i++) {
            result[i] = collection[i].toString();
        }
        return "[ " + String.join(", ", result) + " ]";
    }
    
    
    // Private helper methods
    // ----------------------------------------------------------
    
    // TODO: Add your helper methods here!
    
    // >> [AF] The absence of helper methods here is probably what really got you
    // in both the style and testing -- abstract common code into helpers you can
    // call throughout!
    
}

// ===================================================
// >> [AF] Summary
// ---------------------------------------------------
// Correctness:         87 / 100
// Style Penalty:       -3.5
// Total:               83.5 / 100
// ---------------------------------------------------
// A solid first submission that looks like you did
// some testing and caught all but a few pesky edge
// cases (more next time!), but stylistically leaves room
// for a good amount of improvement. Biggest thing to work
// on for next time: ample use of helper methods to reduce
// code repetition, or being aware of what methods can be
// called in other methods to keep things DRY.
//
// Lastly, you're missing your name in the README (-0.5)
// ===================================================
