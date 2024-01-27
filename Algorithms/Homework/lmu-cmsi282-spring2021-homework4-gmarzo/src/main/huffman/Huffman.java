package main.huffman;

import java.util.*;
import java.io.ByteArrayOutputStream; // Optional

/**
 * Huffman instances provide reusable Huffman Encoding Maps for
 * compressing and decompressing text corpi with comparable
 * distributions of characters.
 */
public class Huffman {
    
    // -----------------------------------------------
    // Construction
    // -----------------------------------------------

    private HuffNode trieRoot;
    // TreeMap chosen here just to make debugging easier
    private TreeMap<Character, String> encodingMap;
    // Character that represents the end of a compressed transmission
    private static final char ETB_CHAR = 23;
    
    /**
     * Creates the Huffman Trie and Encoding Map using the character
     * distributions in the given text corpus
     * @param corpus A String representing a message / document corpus
     *        with distributions over characters that are implicitly used
     *        throughout the methods that follow. Note: this corpus ONLY
     *        establishes the Encoding Map; later compressed corpi may
     *        differ.
     */
    public Huffman (String corpus) {
        
        PriorityQueue<HuffNode> pQueue = new PriorityQueue<HuffNode>();
        Map<Character, Integer> corpusChars = new HashMap<>();
        
        // >> [AF] A... bit too complex of logic in what follows -- hard to tell what's happening in place
        // and why. Better: split up this big function into a variety of more informative and transparent...
        // byte-sized pieces (more helper methods here).
        for (int i = 0; i < corpus.length(); i++) {
            char current = corpus.charAt(i);
            if (corpusChars.containsKey(current)) {
                corpusChars.put(current, corpusChars.get(current) + 1);
            }
            else {
                corpusChars.put(current, 1);
            }
        }
        
        for (char entry: corpusChars.keySet()) {
            HuffNode element = new HuffNode(entry, corpusChars.get(entry));
            pQueue.add(element);
        }
        HuffNode etb = new HuffNode(ETB_CHAR, 1);
        pQueue.add(etb);
        //above creates and fills priority queue w/ corpus characters, counts, and ETB char
        
        while(!(pQueue.isEmpty())) {
            if (pQueue.size() == 1) {
                this.trieRoot = pQueue.poll();
                break;
            }
            
            HuffNode leftPar = pQueue.poll();
            HuffNode rightPar = pQueue.poll();
            // >> [AF] Hmm looks like this might've landed you in trouble as it confounds the
            // tiebreaking criteria that is a function of earliest alphabetic node in a subtree.
            // If your non-leaves use this character for their alphabetic tie-breaking, it will
            // not successfully implement the spec's requirement.
            HuffNode branch = new HuffNode(' ', leftPar.count + rightPar.count);
            branch.left = leftPar;
            branch.right = rightPar;
            pQueue.add(branch);
        }
        //above *SHOULD* create the trie, hoping it works
        
        encodingMap = new TreeMap<Character, String>();
        createEncodingMap(this.trieRoot);
    }
    
    
    // -----------------------------------------------
    // Compression
    // -----------------------------------------------
    
    /**
     * Compresses the given String message / text corpus into its Huffman coded
     * bitstring, as represented by an array of bytes. Uses the encodingMap
     * field generated during construction for this purpose.
     * @param message String representing the corpus to compress.
     * @return {@code byte[]} representing the compressed corpus with the
     *         Huffman coded bytecode. Formatted as:
     *         (1) the bitstring containing the message itself, (2) possible
     *         0-padding on the final byte.
     */
    public byte[] compress (String message) {
        
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        String fullBytes = "";
        for (int i = 0; i < message.length(); i++) {
            fullBytes += this.encodingMap.get(message.charAt(i));
        }
        while (fullBytes.length() % 8 == 0) {
            fullBytes += "0";
        }
        int compressMessage = Integer.parseInt(fullBytes);
        output.write(compressMessage);
        // >> [AF] this varname made me chuckle until I realized it meant "message"
        byte[] flatMess = output.toByteArray();
        return flatMess;
    }
    
    
    // -----------------------------------------------
    // Decompression
    // -----------------------------------------------
    
    /**
     * Decompresses the given compressed array of bytes into their original,
     * String representation. Uses the trieRoot field (the Huffman Trie) that
     * generated the compressed message during decoding.
     * @param compressedMsg {@code byte[]} representing the compressed corpus with the
     *        Huffman coded bytecode. Formatted as:
     *        (1) the bitstring containing the message itself, (2) possible
     *        0-padding on the final byte.
     * @return Decompressed String representation of the compressed bytecode message.
     */
    public String decompress (byte[] compressedMsg) {
        
        String secret = "";
        String message = "";
        HuffNode start = this.trieRoot;
        HuffNode current = start;
        
        for (byte element: compressedMsg) {
            String charBytes = Byte.toString(element);
            secret += charBytes;
        }
        
        for (int i = 0; i < secret.length(); i++) {
            if (secret.charAt(i) == '0') {
                current = current.left;
            }
            
            else if (secret.charAt(i) == '1' ){
                current = current.right;
            }
            
            if (current.isLeaf()) message += Character.toString(current.character);
        }
        
        return message;
    }
    
    
    // -----------------------------------------------
    // Huffman Trie
    // -----------------------------------------------
    
    /**
     * Huffman Trie Node class used in construction of the Huffman Trie.
     * Each node is a binary (having at most a left and right child), contains
     * a character field that it represents, and a count field that holds the 
     * number of times the node's character (or those in its subtrees) appear 
     * in the corpus.
     */
    private static class HuffNode implements Comparable<HuffNode> {
        
        HuffNode left, right;
        char character;
        int count;
        
        HuffNode (char character, int count) {
            this.count = count;
            this.character = character;
        }
        
        public boolean isLeaf () {
            return this.left == null && this.right == null;
        }
        
        // >> [AF] Note that comparators only expect that you return *some* number that is negative,
        // positive, or zero; you're not restricted to {-1, 0, 1}. Noting the above would allow you
        // to simply return the difference between these values and simplify the logic (-0.5)
        public int compareTo (HuffNode other) {
            if (this.count > other.count) return 1;
            if (this.count < other.count) return -1;
            if (this.character > other.character) return 1;
            if (this.character < other.character) return -1;
            return 0;
        }
        
    }
    
    //Helper Method(s)
    
    /**
     * Wrapper for makeTheMap recursive method.
     * @param root The HuffNode to begin recursion at, in this case
     *             root of the Huffman Trie.
     */
    private void createEncodingMap(HuffNode root){
        
        String leafByte = "";
        makeTheMap(root, leafByte);
    }
    
    /**
     * Fills the encoding map by using DFT in the Huffman Trie
     * @param current The current HuffNode that the method is recursing at.
     * @param leafByte The String that is to be the value for the
     *        char key, fills out as the tree is traversed.
     */
    private void makeTheMap(HuffNode current, String leafByte){
       
        if (current.isLeaf()) {
            
            this.encodingMap.put(current.character, leafByte);
            return;
        }
        
        if (current.left != null) {
            makeTheMap(current.left, leafByte + "0");
        }
        
        if (current.right != null) {
            makeTheMap(current.right, leafByte + "1");
        }
    }
}

// ===================================================
// >>> [AF] Summary
// ---------------------------------------------------
// Correctness:         53.5 / 100
// Style Penalty:       -0.5
// Late (-20%):         -10
// Total:               43 / 100
// ---------------------------------------------------
// Well my friend, here we find ourselves once again,
// a lot of effort complete with strong fundamentals,
// but just doesn't quite do what it's supposed to do.
// At risk to sounding like a broken record, these are
// not assignments you can complete in a single sitting
// and especially not close to the deadline. Let me
// know if you want to chat, I'm just not sure how I
// can help when I don't hear from you and I want
// nothing more than your thriving success!
// ===================================================
