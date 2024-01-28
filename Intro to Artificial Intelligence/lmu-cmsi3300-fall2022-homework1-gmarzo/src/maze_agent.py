'''
BlindBot MazeAgent meant to employ Propositional Logic,
Search, Planning, and Active Learning to navigate the
Maze Pitfall problem
'''

import time
import random
from pathfinder import *
from maze_problem import *
from queue import Queue

# [!] TODO: import your Problem 1 when ready here!

from maze_clause import *
from maze_knowledge_base import *

class MazeAgent:
    
    ##################################################################
    # Constructor
    ##################################################################
    
    def __init__ (self, env, perception):
        """
        Initializes the MazeAgent with any attributes it will need to
        navigate the maze
        :env: The Environment in which the agent is operating
        :perception: The starting perception of the agent, which is a
        small dictionary with keys:
          - loc:  the location of the agent as a (c,r) tuple
          - tile: the type of tile the agent is currently standing upon
        """
        self.env  = env
        self.loc  = env.get_player_loc()
        self.goal = env.get_goal_loc()
        
        # The agent's maze can be manipulated as a tracking mechanic
        # for what it has learned; changes to this maze will be drawn
        # by the environment and is used for visuals and pathfinding
        self.maze = env.get_agent_maze()
        self.maze_problem = MazeProblem(self.maze)
        
        # The agent's plan will be a queue storing the sequence of
        # actions that the environment will execute
        self.plan = Queue()
        
        # [!] TODO: Initialize any other knowledge-related attributes for
        # agent here, or any other record-keeping attributes you'd like
        self.kb = MazeKnowledgeBase()

        self.safe_tiles = set()
        self.explored_tiles = set()
        self.curious_tiles = set()
        self.dangerous_tiles = set()

        self.kb.tell(MazeClause([(("P", self.goal), False)]))
    
    
    ##################################################################
    # Methods
    ##################################################################
    
    # [!] TODO! Agent is currently dumb; this method should perform queries
    # on the agent's knowledge base from its gathered perceptions
    def is_safe_tile (self, loc):
        """
        Can be used in the think method or unit tests for determining whether
        or not a tile given in the provided location is safe (i.e., sans Pit).
        :loc: A tuple (c,r) with a presumably valid maze location that is within
              the non-wall bounds of the current maze
        :returns: One of three return values:
              1. True if the location is certainly safe (i.e., not pit)
              2. False if the location is certainly dangerous (i.e., pit)
              3. None if the safety of the location cannot be currently determined
        """
        #Check if loc is a pit
        #If true, add pit to kb and return False. Query kb if pit
        if self.kb.ask(MazeClause([(("P", loc), True)])):
            return False
        #If false, add safe to kb and return True. Query kb if not pit
        elif self.kb.ask(MazeClause([(("P", loc), False)])):
            return True
        #Making it through both of these should return None.
        else:
            return None
    
    # [!] TODO! Agent currently just runs straight up
    def think(self, perception):
        """
        think is parameterized by the agent's perception of the tile type
        on which it is now standing, and is called during the environment's
        action loop. This method is the chief workhorse of your MazeAgent
        such that it must then generate a plan of action from its current
        knowledge about the environment.
        
        :perception: A dictionary providing the agent's current location
        and current tile type being stood upon, of the format:
          {"loc": (x, y), "tile": tile_type}
        """
        # Code put here as a joke more or less
        # My special boi

        # if self.loc[1] != self.goal[1]:
        #     if self.loc[1] < self.goal[1]:
        #         self.plan.put("D")
        #         self.loc = (self.loc[0], self.loc[1]+1)
        #     else:
        #         self.plan.put("U")
        #         self.loc = (self.loc[0], self.loc[1]-1)
        # else:
        #     if self.loc[0] < self.goal[0]:
        #         self.plan.put("R")
        #         self.loc = (self.loc[0]+1, self.loc[1])
        #     else:
        #         self.plan.put("L")
        #         self.loc = (self.loc[0]-1, self.loc[1])

        self.explored_tiles.add(perception["loc"])
        self.kb.tell(MazeClause([((Constants.PIT_BLOCK, perception["loc"]), True)])) if perception['tile'] == Constants.PIT_BLOCK else self.kb.tell(MazeClause([((Constants.PIT_BLOCK, perception["loc"]), False)]))
        #Add safe tiles dictated by position
        possible_moves = self.maze_problem.transitions(perception["loc"])
        for move in possible_moves:
            if move[2] == self.goal:
                self.plan.put(move[0])
                return

        # goal_path = pathfind(self.maze_problem, perception["loc"], self.goal)

        if perception["tile"] in [".", "1", "2", "3"]:
            match(perception["tile"]):
                case ".":
                    for i in range(1, 4):
                        for tile in self.env.get_cardinal_locs(perception["loc"], i):
                            if tile in self.env.get_playable_locs():
                                self.safe_tiles.add(tile)
                                self.kb.tell(MazeClause([((Constants.PIT_BLOCK, tile), False)]))
                case "1":
                    potential_pits = set()
                    for move in possible_moves:
                        if self.is_safe_tile(move[2]) == None:
                            if move[2] not in self.explored_tiles and move[2] not in self.curious_tiles:
                                self.curious_tiles.add(move[2]) 
                                potential_pits.add(move[2])
                        elif self.is_safe_tile(move[2]) == False:
                            self.dangerous_tiles.add(move[2])
                        elif self.is_safe_tile(move[2]) == True:
                            self.safe_tiles.add(move[2])
                    if len(potential_pits) != 0:
                        self.kb.tell(MazeClause([((Constants.PIT_BLOCK, tile), True) for tile in potential_pits]))
               
                case "2" | "3":
                    for i in range(1, int(perception['tile'])):
                        for tile in self.env.get_cardinal_locs(perception["loc"], i):
                            self.kb.tell(MazeClause([(("P", tile), False)]))
                            if tile in self.env.get_playable_locs():
                                self.safe_tiles.add(tile)

        move_routes = [(tile[2], tile[0], pathfind(self.maze_problem, tile[2], self.goal)) for tile in possible_moves if tile not in self.explored_tiles]
       
        move_routes.sort(key=lambda x: x[2][0])
        
        if move_routes[0][0] in self.safe_tiles and move_routes[0][0] not in self.explored_tiles:
            self.plan.put(move_routes[0][1])
        else:
            safe_routes = [(tile, pathfind(self.maze_problem, tile, self.goal)) for tile in self.safe_tiles.difference(self.explored_tiles)]
            
            #print("Safe routes: ", safe_routes)
            safe_routes.sort(key=lambda x: x[1][0])
            if len(safe_routes) == 0:
                curious_routes = [(tile, pathfind(self.maze_problem, tile, self.goal)) for tile in self.curious_tiles]
                curious_routes.sort(key=lambda x: x[1][0])
                closest_curious = curious_routes[0]
                to_closest = pathfind(self.maze_problem, perception["loc"], closest_curious[0])[1]
                #print("Closest curious: ", to_closest)
                self.plan.put(to_closest[0])
            else:
                closest_safe = safe_routes[0]
                #print("Closest safe: ", closest_safe)
                to_safest = pathfind(self.maze_problem, perception['loc'], closest_safe[0])[1]
                #print(to_safest)
                self.plan.put(to_safest[0])
            
            
        
    def get_next_move(self):
        """
        Returns the next move in the plan, if there is one, otherwise None
        [!] You should NOT need to modify this method -- contact Dr. Forney
            if you're thinking about it
        """
        return None if self.plan.empty() else self.plan.get()
    