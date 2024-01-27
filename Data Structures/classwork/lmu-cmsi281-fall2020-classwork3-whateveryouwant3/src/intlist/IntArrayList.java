package intlist;

/**
 * Name: IntArrayList
 * Authors: Jennifer Siao and Garrett Marzo
 * Due Date: 9/30/2020
 * Description: Simple implementation of an ArrayList of ints
 */

public class IntArrayList implements IntListInterface {

    // Constants
    // --------------------------------------------------------------------
    private static final int START_SIZE = 8;

    // Fields
    // --------------------------------------------------------------------
    private int[] items;
    private int   size;
    
    // Constructor
    // --------------------------------------------------------------------
    IntArrayList () {
        items = new int[START_SIZE];
        size  = 0;
    }
    
    // Public methods
    // --------------------------------------------------------------------
    
    /**
     * Returns number of currently stored ints
     * @return Number of ints stored
     */
    public int size () {
        return size;
    }

    /**
     * Returns the int stored at the given index
     * in the IntList.
     * @param index The index requested, in the range of [0, size-1]
     * @return The int at the index in the IntList.
     */
    public int getAt (int index) {
        indexValidityCheck(index, 0, size);
        return items[index];
    }

    /**
     * Adds the given int toAdd to the end of the IntList
     * @param toAdd The int to append
     */
    public void append (int toAdd) {
        checkAndGrow();
        items[size] = toAdd;
        size++;
    }
    
    /**
     * Removes the int at the given index
     * @param index The index at which to remove an element
     */
    public void removeAt (int index) {
        indexValidityCheck(index, 0, size);
        shiftLeft(index);
        size--;
    }
    
    /**
     * Returns a convenient print-out representation of the
     * given IntList
     */
    @Override
    public String toString () {
        String[] result = new String[size];
        for (int i = 0; i < size; i++) {
            result[i] = "" + items[i];
        }
        return String.join(", ", result);
    }
    
    
    // Public methods - TODO
    // --------------------------------------------------------------------

    /**
     * Adds a given int at a given index in
     * the array list.
     * @param toAdd The int that is to be added to the array list.
     * @param index The index in the array list toAdd will be placed.
     */
    public void insertAt (int toAdd, int index) {
        size = items.length;
        int[] newItems = new int[items.length*2];
        for (int i = index; i < items.length; i++) {
            newItems[i+1] = items[i];
        }
        newItems[index] = toAdd;
        items = newItems;
        size++;
    }
    /**
     * Adds a given int to the first index of the list
     * and moves all other ints to the right.
     * @param toAdd The int to be added at index 0.
     */
    public void prepend (int toAdd) {
    	//assigning toAdd to the first index in the list
    	int[] newItems = new int[items.length*2]; 
    	for (int i = 0; i < items.length; i++) {
    		newItems[i+1] = items[i]; 
    	}
    	newItems[0]= toAdd; 
    	items = newItems;
    	size++;
    }
    /**
     * Removes all instances of a given int in the array list.
     * @param toRemove The int to be removed from the list.
     */
    public void removeAll (int toRemove) {
        boolean toRemoveExists = false;
        int filler = 0;
        int[] newItems = new int[items.length];
        for (int i = 0; i < items.length; i++) {
            if (items[i] != toRemove) {
                newItems[filler] = items[i];
                filler++;
            }
            else {
                size--;
                toRemoveExists = true;
            }
        }
        if (!(toRemoveExists)) return;
        items = newItems;
    }
    
    
    // Private helper methods
    // --------------------------------------------------------------------
    
    /**
     * Ensures that the requested index is within a legal range,
     * as also specified
     * @param index The index to check
     * @param lower The legal lower bound (exclusive)
     * @param upper The legal upper bound (inclusive)
     */
    private void indexValidityCheck (int index, int lower, int upper) {
        if (index < lower || index >= upper) {
            throw new IndexOutOfBoundsException();
        }
    }
    
    /*
     * Expands the size of the list whenever it is at
     * capacity
     */
    private void checkAndGrow () {
        // Case: big enough to fit another item, so no
        // need to grow
        if (size < items.length) {
            return;
        }
        
        // Case: we're at capacity and need to grow
        // Step 1: create new, bigger array; we'll
        // double the size of the old one
        int[] newItems = new int[items.length * 2];
        
        // Step 2: copy the items from the old array
        for (int i = 0; i < items.length; i++) {
            newItems[i] = items[i];
        }
        
        // Step 3: update IntList reference
        items = newItems;
    }
    
    /*
     * Shifts all elements to the right of the given
     * index one left
     */
    private void shiftLeft (int index) {
        for (int i = index; i < size-1; i++) {
            items[i] = items[i+1];
        }
    }
    
}