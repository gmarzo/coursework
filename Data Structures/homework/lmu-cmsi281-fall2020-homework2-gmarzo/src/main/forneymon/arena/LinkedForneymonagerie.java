package main.forneymon.arena;

import java.util.Objects;
import main.forneymon.fmtypes.*;


/**
 * Collections of Forneymon ready to fight in the arena!
 */
public class LinkedForneymonagerie implements ForneymonagerieInterface {

    // Fields
    // -----------------------------------------------------------
    private Node sentinel;
    private int size, modCount;
    
    
    // Constructor
    // -----------------------------------------------------------
    public LinkedForneymonagerie () {
        // [!] Leave this constructor as-is, you may not modify!
        this.size = this.modCount = 0;
        this.sentinel = new Node(null);
        this.sentinel.next = this.sentinel;
        this.sentinel.prev = this.sentinel;
    }
    
    
    // Methods
    // -----------------------------------------------------------
    
    /**
     * Returns whether the LinkedForneymonagerie has no Forneymon within it.
     * @return boolean indicating if the size is 0.
     */
    public boolean empty () {
        return (this.size == 0);
    }
    
    /**
     * Returns an int representing the number of Forneymon with the LinkedForneymonagerie.
     * @return The number of Forneymon present in the LinkedForneymonagerie.
     */
    public int size () {
        return this.size;
    }
    
    /**
     * Attempts to add a new node containing a Forneymon "toAdd" to the LinkedForneymonagerie,
     * with 2 cases where it is not added
     *     1. toAdd is already in the LinkedForneymonagerie (does nothing)
     *     2. The FMType of toAdd matches a different Forneymon in the LinkedForneymonagerie
     *        (Adds toAdd's level to the Forneymon already inside)
     * 
     * @param toAdd The Forneymon to be added to the LinkedForneymonagerie.
     * @return boolean on whether or not toAdd was added successfully.
     */
    public boolean collect (Forneymon toAdd) {
        
        Node newFm = new Node(toAdd);
        // >> [MT] Not a great name here, `looped` sounds like it should be a boolean,
        // something like loopIndex would be more appropriate!
        int looped = 0;

        // >> [MT] Looots of repetition below; see how you're repeating the same reference settings
        // and changes to the fields? Time to make a helper and restructure the logic so you don't
        // need to repeat (-1)
        if (empty()) {
            this.sentinel.next = newFm;
            this.sentinel.prev = newFm;
            newFm.prev = this.sentinel;
            newFm.next = this.sentinel;
            this.size++;
            this.modCount++;
            return true;
        }
        
        if (!(containsType(toAdd.getFMType()))) {
            newFm.prev = this.sentinel.prev;
            newFm.next = this.sentinel;
            this.sentinel.prev.next = newFm;
            this.sentinel.prev = newFm;
            this.size++;
            this.modCount++;
            return true;
        }
        
        // >> [MT] Efficiency-wise, a little problematic that you're calling containsType
        // again and checking for the opposite condition, that's an O(n) operation
        // you're repeating needlessly when all you need is an else clause! (-0.5)
        if (containsType(toAdd.getFMType())) {
          for (Node i = this.sentinel; looped < size; i = i.next) {
              if (i.fm == toAdd) return false;
              if (i.fm.getFMType().equals(toAdd.getFMType())) {
                  i.fm.addLevels(toAdd.getLevel());
                  return false;
              }
              looped++;
          }
        }
       return false;
    }
    
    /**
     * Removes a Forneymon of type "fmType" from the LinkedForneymonagerie, if present.
     * @param fmType A String representation of the type of Forneymon to be removed.
     * @return boolean Whether the given FM type was removed.
     */
    public boolean releaseType (String fmType) {
        Node toRemove = null;
        int looped = 0;
        if (!containsType(fmType)) return false;
        // >> [MT] A big missed opportunity here to use getTypeIndex
        // instead of iterating through the linked list again to find 
        // the node.
        for (Node i = this.sentinel.next; looped < size - 1; i = i.next) {
            if (i.fm.getFMType().equals(fmType)) {
                toRemove = i;
                break;
            }
        }
        toRemove.next.prev = toRemove.prev;
        toRemove.prev.next = toRemove.next;
        this.size--;
        this.modCount++;
        return true;
    }
    
    /**
     * Returns the Forneymon at a given index in the LinkedForneymonagerie.
     * @param index The position of the Forneymon that is being checked.
     * @return Forneymon The Forneymon at the given param index.
     */
    public Forneymon get (int index) {
        if (index < 0 || index >= this.size) throw new IllegalArgumentException();
        
        Node toReturn = null;
        // >> [MT] Again, bad naming for a loopIndex variable, this one's not 
        // forgivable since there is already a variable named index given to you. (-1)
        int loops = index;
        for (Node i = this.sentinel.next; loops >= 0; i = i.next) {
            if (loops == 0) toReturn = i;
            loops--;
        }
        return toReturn.fm;
    }
    
    /**
     * Removes a Forneymon at the given index in the LinkedForneymonagerie.
     * @param index The position of the Forneymon to be removed.
     * @return Forneymon The Forneymon that is removed.
     */
    public Forneymon remove (int index) {
        Node toRemove = null;
        // >> [MT] There is no need to make a new variable and assign it to an existing
        // variable if you don't need both copies, simply use index instead! (-0.5)
        int loops = index;
        // >> [MT] See how your iteration here to find the node toRemove is practically
        // the same as the iteration in the method above to find the node toReturn? 
        // Time to extract this into a helper method! (-1)
        for (Node i = this.sentinel.next; loops >= 0; i = i.next) {
            if (loops == 0) toRemove = i;
            loops--;
        }
        toRemove.prev.next = toRemove.next;
        toRemove.next.prev = toRemove.prev;
        this.size--;
        this.modCount++;
        return toRemove.fm;
    }
    
    /**
     * Returns the index position of the Forneymon of given type "fmType" if present.
     * @param fmType String representation of the FM type to be checked.
     * @return int The index of the given Forneymon of type fmType, or -1 if
     * there are no Forneymon of the type.
     */
    public int getTypeIndex (String fmType) {
        int loops = 0;
        if (!containsType(fmType)) return -1;
        for (Node i = this.sentinel.next; loops <= this.size; i = i.next) {
            if (i.fm.getFMType().equals(fmType)) break;
            loops++;
        }
        return loops;
    }
    
    /**
     * Returns T/F to whether the LinkedForneymonagerie contains a Forneymon of type "toCheck"
     * @param toCheck The String form of the checked FMType.
     * @return boolean Whether the LinkedForneymonagerie hold a Forneymon of type "toCheck".
     */
    public boolean containsType (String toCheck) {
        int looped = 0;
        // >> [MT] Again, see how this following for loop is VERY similar to what you're
        // doing in getTypeIndex and releaseType? You could have called getTypeIndex
        // in both releaseType and containsType instead! (-1)
        for (Node i = this.sentinel.next; looped < this.size; i = i.next) {
            if (i.fm.getFMType().equals(toCheck)) return true;
            looped++;
        }
        return false;
    }
    
    /**
     * Swaps the contents of two given Forneymonagerie.
     * @param other The Forneymonagerie to be traded with.
     */
    public void trade (LinkedForneymonagerie other) {
        Node hold = other.sentinel;
        int sizeHold = other.size;
        other.sentinel = this.sentinel;
        this.sentinel = hold;
        other.size = this.size;
        this.size = sizeHold;
        this.modCount++;
        other.modCount++;
        
    }
    
    /**
     * Moves a Forneymon of type fmType to the given index within the Forneymonagerie.
     * @param fmType The type of Forneymon to be moved.
     * @param index The index the Forneymon will be moved to.
     */
    public void rearrange (String fmType, int index) {
        if (index < 0 || index >= size) throw new IllegalArgumentException();
        if (!(containsType(fmType))) throw new IllegalArgumentException();
        
        Node toRearrange = null;
        int looped = 0;
        
        // >> [MT] Here, you're making two separate for loops, which are
        // used to find the node of the right type (whose index you
        // could get with getTypeIndex) and to get the node at index (similar
        // to what you did in get and remove!), both of which you could
        // achieve with pre-existing code and methods. (-1)
        for (Node i = this.sentinel.next; looped <= this.size; i = i.next) {
            if (i.fm.getFMType().equals(fmType)) {
                toRearrange = i;
                i.prev.next = i.next;
                i.next.prev = i.prev;
                looped = 0;
                break;
            }
            looped++;
        }
        
        for (Node i = this.sentinel.next; looped <= index; i = i.next) {
            if (looped == index) {
                toRearrange.prev = i.prev;
                toRearrange.next = i;
                i.prev.next = toRearrange;
                i.prev = toRearrange;
                break;
            }
            looped++;
        }
        this.modCount++;
        return;
    }
    
    /**
     * Creates an iterator for the given Forneymonagerie.
     * @return Iterator that was created.
     */
    public LinkedForneymonagerie.Iterator getIterator () {
        Iterator linkedIt = new Iterator(this);
        return linkedIt;
    }
    
    @Override
    /**
     * Creates a nre Forneymonagerie with copies of the attached Forneymonagerie's collection
     */
    public LinkedForneymonagerie clone () {
        
        LinkedForneymonagerie newFm = new LinkedForneymonagerie();
        Forneymon copy = null;
        int looped = 0;
        
        for (Node i = this.sentinel.next; looped < this.size; i = i.next) {
            copy = i.fm.clone();
            newFm.collect(copy);
            looped++;
        }
        return newFm;
    }
    
    @Override
    /**
     * Returns T/F if the attached Forneymonagerie has the same Forneymon in the same order
     * as the Forneymonagerie "other".
     * @param other The Forneymonagerie to be compared.
     */
    public boolean equals (Object other) {
        if (this.size != ((LinkedForneymonagerie)(other)).size) return false;
        
        Node j = ((LinkedForneymonagerie)other).sentinel.next;
        int looped = 0;
        
        for (Node i = this.sentinel.next; looped < this.size; i = i.next) {
            if (!(i.fm.equals(j.fm))) return false;
            j = j.next;
            looped++;
        }
        return true;
    }
    
    @Override
    public int hashCode () {
        return Objects.hash(this.sentinel, this.size, this.modCount);
    }
    
    @Override
    public String toString () {
        String[] result = new String[size];
        int i = 0;
        for (Node curr = this.sentinel.next; curr != this.sentinel; curr = curr.next, i++) {
            result[i] = curr.fm.toString();
        }
        return "[ " + String.join(", ", result) + " ]";
    }
    
    
    // Private helper methods
    // -----------------------------------------------------------

    // [!] TODO: Add your private helpers here!
    
    
    // Inner Classes
    // -----------------------------------------------------------
    
    public class Iterator {
        private LinkedForneymonagerie host;
        private Node current;
        private int itModCount;
        
        Iterator (LinkedForneymonagerie host) {
            this.host = host;
            this.current = host.sentinel.next;
            this.itModCount = host.modCount;
        }
        
        /**
         * Returns T/F whether the iterator is at the last node of the LinkedForneymonagerie
         * that is not the sentinel.
         * @return boolean Whether iterator is at the last node.
         */
        public boolean atEnd () {
            if (isValid()) return this.current.next == host.sentinel;
            return false;
        }
        
        /**
         * Returns T/F whether the iterator is at the first node of the LinkedForneymonagerie
         * that is not the sentinel.
         * @return boolean Whether iterator is at the first node.
         */
        public boolean atStart () {
            if (isValid()) return this.current.prev == host.sentinel;
            return false;
        }
        
        /**
         * Returns if the iterator is valid for the current LinkedForneymonagerie.
         * @return boolean If the iterator is valid.
         */
        public boolean isValid () {
            return host.modCount == this.itModCount;
        }
        
        /**
         * Returns the Forneymon of the node the iterator is currently at.
         * @return Forneymon The Forneymon contained by the current node.
         */
        public Forneymon getCurrent () {
            if (!(isValid())) throw new IllegalStateException();
            return this.current.fm;
        }
        
        /**
         * Moves the iterator to the next node in the LinkedForneymonagerie. If the next
         * node is the sentinel, instead moves to the node after the sentinel.
         */
        public void next () {
            if (!(isValid())) throw new IllegalStateException();
            this.current = this.current.next;
            if (this.current == host.sentinel) this.current = this.current.next;
            return;
        }
        
        /**
         * Moves the iterator to the previous node in the LinkedForneymonagerie. If the
         * previous node is the sentinel, instead moves to the node before the sentinel.
         */
        public void prev () {
            if (!(isValid())) throw new IllegalStateException();
            this.current = this.current.prev;
            if (this.current == host.sentinel) this.current = this.current.prev;
            return;
        }
        
        /**
         * Removes the current node from the LinkedForneymonagerie.
         * @return Forneymon The Forneymon contained by the node being removed.
         */
        public Forneymon removeCurrent () {
            if (!(isValid())) throw new IllegalStateException();
           
            this.current.prev.next = this.current.next;
            this.current.next.prev = this.current.prev;
            prev();
            host.size--;
            host.modCount++;
            this.itModCount++;
            return this.current.fm;
        }
        
    }
    
    private class Node {
        Node next, prev;
        Forneymon fm;
        
        Node (Forneymon fm) {
            this.fm = fm;
        }
    }
    
}

// ===================================================
// >>> [MT] Summary
// ---------------------------------------------------
// Correctness:         82 / 100 (-1.5pts / missed test)
// Style Penalty:       -6
// Total:               76 / 100
// ---------------------------------------------------
// Overall a solid effort for this assignment! There is
// room to improve testing, as it seems like some edge
// cases managed to slip by. Stylistically there is a
// good amount of room for improvement, especially with 
// extracting helper methods and employing some other
// methods that you already wrote to keep your code
// DRY. In addition, work on good variable
// naming and avoid making unnecessary variables.
// Keep an eye out on the above for the next 
// assignments, but otherwise good work!
// ===================================================