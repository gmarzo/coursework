package main.wiki;

import java.util.*;

public class WikiWalker {

    // TODO: Choose some data structure to implement the site map!
    HashMap<String, HashMap<String, Integer>> siteMap = 
            new HashMap<String, HashMap<String, Integer>>();

    public WikiWalker() {
        // TODO: Any initializations you need
    }

    /**
     * Adds an article with the given name to the site map and associates the
     * given linked articles found on the page. Duplicate links in that list are
     * ignored, as should an article's links to itself.
     * 
     * @param articleName
     *            The name of the page's article
     * @param articleLinks
     *            List of names for those articles linked on the page
     */
    public void addArticle(String articleName, List<String> articleLinks) {
        HashMap<String, Integer> innerMap = new HashMap<String, Integer>();
        for (int i = 0; i < articleLinks.size(); i++) {
            if (articleLinks.get(i).equals(articleName)) continue;
            innerMap.put(articleLinks.get(i), 0);
        }
        siteMap.put(articleName, innerMap);
    }

    /**
     * Determines whether or not, based on the added articles with their links,
     * there is *some* sequence of links that could be followed to take the user
     * from the source article to the destination.
     * 
     * @param src
     *            The beginning article of the possible path
     * @param dest
     *            The end article along a possible path
     * @return boolean representing whether or not that path exists
     */
    public boolean hasPath(String src, String dest) {
        HashSet<String> tried = new HashSet<>();
        return hasPath(src, dest, tried);
    }

    /**
     * Increments the click counts of each link along some trajectory. For
     * instance, a trajectory of ["A", "B", "C"] will increment the click count
     * of the "B" link on the "A" page, and the count of the "C" link on the "B"
     * page. Assume that all given trajectories are valid, meaning that a link
     * exists from page i to i+1 for each index i
     * 
     * @param traj
     *            A sequence of a user's page clicks; must be at least 2 article
     *            names in length
     */
    public void logTrajectory(List<String> traj) {
        
        int trajTrack = 0;
        String current = traj.get(trajTrack);
        
        while (trajTrack < traj.size() - 1) {
            siteMap.get(current).replace(traj.get(trajTrack + 1), siteMap.get(current).get(traj.get(trajTrack + 1)) + 1);
            trajTrack++;
            current = traj.get(trajTrack);
        }
    }

    /**
     * Returns the number of clickthroughs recorded from the src article to the
     * destination article. If the destination article is not a link directly
     * reachable from the src, returns -1.
     * 
     * @param src
     *            The article on which the clickthrough occurs.
     * @param dest
     *            The article requested by the clickthrough.
     * @throws IllegalArgumentException
     *             if src isn't in site map
     * @return The number of times the destination has been requested from the
     *         source.
     */
    public int clickthroughs(String src, String dest) {
        
        HashMap<String, Integer> innerMap = siteMap.get(src);
        
        if (!(siteMap.containsKey(src))) throw new IllegalArgumentException();
        if (!(innerMap.containsKey(dest))) return -1;
        
        return innerMap.get(dest);
    }

    /**
     * Based on the pattern of clickthrough trajectories recorded by this
     * WikiWalker, returns the most likely trajectory of k clickthroughs
     * starting at (but not including in the output) the given src article.
     * Duplicates and cycles are possible outputs along a most likely trajectory. In
     * the event of a tie in max clickthrough "weight," this method will choose
     * the link earliest in the ascending alphabetic order of those tied.
     * 
     * @param src
     *            The starting article of the trajectory (which will not be
     *            included in the output)
     * @param k
     *            The maximum length of the desired trajectory (though may be
     *            shorter in the case that the trajectory ends with a terminal
     *            article).
     * @return A List containing the ordered article names of the most likely
     *         trajectory starting at src.
     */
    public List<String> mostLikelyTrajectory(String src, int k) {
        List<String> visited = new ArrayList<>();
        return mostLikelyTrajectory(src, k, visited);
    }

    /**
     * Private helper method for hasPath(). Recursively checks the links
     * in each article until it finds the article dest, or reaches terminal
     * articles without dest. Returns T/F depending on the result.
     * @param src
     *              The starting article.
     * @param dest
     *              The article to be found from the source article.
     * @param tried
     *              List of type String that keeps track of what articles
     *              have already been visited. Prevents looping.
     * @return boolean representation of whether a successful path was found.
     */
    private boolean hasPath(String src, String dest, HashSet<String> tried) {
        if (src.equals(dest)) return true;
        
        HashMap<String, Integer> innerMap = siteMap.get(src);
        
        if (innerMap == null || innerMap.isEmpty()) return false;
        else if (innerMap.containsKey(dest)) return true;
       
        for (String current: innerMap.keySet()) {
            if (tried.contains(current)) continue;
            tried.add(current);
            if (hasPath(current, dest, tried)) return true;
        }
        return false;
    }
    
    /**
     * Private helper method for mostLikelyTrajectory(). Recursively adds the article
     * from src with the highest clicks to a List of type String, visited.  Returns
     * that list upon the size reaching k, or hitting a terminal article.
     * @param src
     *              The starting article passed from mostLikelyTrajectory().
     * @param k
     *              The maximum desired length of trajectory passed from
     *              mostLikelyTrajectory().
     * @param visited
     *              List of type String that keeps track of every article visited
     *              after the source article.
     * @return A list containing all the articles visited in the trajectory
     *         after the source  article.
     */
    private List<String> mostLikelyTrajectory(String src, int k, List<String> visited){
        
        HashMap<String, Integer> innerMap = siteMap.get(src);
        String mostClicked = "";
        int mostClicks = 0;
        
        if (visited.size() == k || innerMap == null ||  innerMap.isEmpty()) return visited;
        
        Set<String> innerKeys = innerMap.keySet();
        
        for (String current: innerKeys) {
            if (clickthroughs(src, current) > mostClicks) {
                mostClicks = innerMap.get(current);
                mostClicked = current;
            }
        }
        if (mostClicked.equals("")) {
            mostClicked = earliestChar(innerKeys);
            visited.add(mostClicked);
        } else{
            visited.add(mostClicked);
        }
        return mostLikelyTrajectory(mostClicked, k, visited);
    }
    
    /**
     * Private helper method inside of the mostLikelyTrajectory() helper
     * method. Returns a String of the earliest alphabetical entry in the
     * article links. Assumes all entries have the same number of
     * clickthroughs, and are one letter.
     * @param innerKeys
     *              A set representation of the article links in
     *              mostLikelyTrajectory().
     * @return A string of the earliest alphabetical article link.
     */
    private String earliestChar(Set<String> innerKeys) {
        
        String earliestChar = "z";
        
        for (String current: innerKeys) {
            if (Character.toLowerCase(current.charAt(0)) - Character.toLowerCase(earliestChar.charAt(0)) <= 0) {
                earliestChar = current;
            }
            
        }
        return earliestChar;
    }
}
