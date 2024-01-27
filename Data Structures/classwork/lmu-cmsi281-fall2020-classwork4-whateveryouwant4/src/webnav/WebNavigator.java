package webnav;

import java.util.LinkedList;

/**
 * Web Navigator used to track which URLs a user is currently
 * or was previously browsing, as well as tools for updating the
 * currently viewed based on their session history.
 * Authors: Jennifer Siao and Garret Marzo 
 * Due Date: 10/12/2020
 */
public class WebNavigator {

    private String current;
    private LinkedList<String>webNavHistory = new LinkedList<String>(); 
    private int index; 
    
    
    //Constructor:
    //------------
    WebNavigator () {
    	this.current = null; 
    	this.index = 0;
}
    
    
    //Methods:
    //--------------
    
    /**
     *  Visits the current site, clears the forward history,
     *  and records the visited site in the back history
     *  @param site The new site being visited
     */
    public void visit (String site) {
    	this.webNavHistory.addLast(site);
    	this.current = site; 
    	this.index = this.webNavHistory.size()-1; 
    }
    
    /**
     *  Changes the current site to the one that was last
     *  visited in the order on which visit was called on it
     */
    public void back () {
    	if(this.index > 0) {
    		this.index--; 
    	}
        this.current = this.webNavHistory.get(this.index).toString();
    }
    
    /**
     * Changes the current site to the one that was last
     * returned to via back()
     */
    public void forw () {
    	if(this.index < this.webNavHistory.size()-1) {
    		this.index++; 
    	}
        this.current = this.webNavHistory.get(this.index).toString();
     }
    
    /**
     * Returns the String representing the site that the navigator
     * is currently at
     * @return The current site's URL
     */
    public String getCurrent () {
        return this.current;
    }
    
}
