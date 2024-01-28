def change(amount):
    if type(amount) != int or amount % 1 != 0:
        raise TypeError("Amount must be an int.")
    
    if amount < 0:
        raise ValueError("amount cannot be negative")

    quarters = amount//25
    amount %= 25

    dimes = amount//10
    amount %= 10

    nickels = amount//5

    pennies = amount % 5
    return (quarters, dimes, nickels, pennies)

def stretched(s):
    characters = list(''.join(s.split()))
    # s.split() makes s into a list where each word is a list item, get's rid of /n /t ' '
        # 'woof /t/n woof'.split() -> ['woof', 'woof']
    # ''.join(s.split()) makes it into a string with no spaces
        # ''.join('woof /t/n woof'.split()) = ''.join(['woof', 'woof']) -> 'woofwoof'
        # ' '.join('woof /t/n woof'.split()) = ' '.join(['woof', 'woof']) -> 'woof woof'
    answer = ""

    for index, char in enumerate(characters):
        answer += char * (index + 1)
    # TLDR - enumerate gives us access to the index in the list
        # see here for more info - https://realpython.com/python-enumerate/

    return answer

def powers(*, base, limit):
    
    power = 0
    while base ** power <= limit:
        yield base ** power
        power += 1

def say(s = None):
    if s is None:
        return ""
    answer = s
    
    def getMoreWords(str = None):
        nonlocal answer
        # this answer ^ is nonlocal which causes it bind to the nerest non-global variable which is also named answer
        if str is None:
            return answer
        else:
            answer += (" " + str)
            return getMoreWords
            
    return getMoreWords

def find_first_then_lower(predicate, strings):
    #predicate is a function that returns a boolean
    return strings != [] and ''.join(filter(predicate, strings)).lower() or None
    #short hand if statement
        # if strings != [] then return ''.join(filter(predicate, strings)).lower()
        #else return None
    # filter returns a new list where each element is a 'strings' element that returned in the predicate

def top_ten_scorers(stats):
    # Returns top 10 players based off PPG
    allPlayers = []
    
    for team in stats.keys():
        for player in stats[team]:
            player.append(team)
            if player[1] >= 15:
                allPlayers.append(player)

    ppgList = []          

    for player in allPlayers:
        ppgList.append((player[0], f'{"{:.2f}".format(player[2]/player[1])}', player[3])) #Creates new list with player name and PPG

    ppgList = sorted(ppgList, key = lambda player: player[1],reverse = True) #Sorts the players by their PPG in Descending Order

    ppgList = ppgList[:10] #Will display the top 10 players only

    topTen = []
    for player in ppgList:
        topTen.append("|".join(player))

    return topTen
    

def turing_machine(machine, input):
    
    configurations = []
# Organize tm instructions into actions based on the state and read
    instructions = machine.split()
    actions = {}
    for line in instructions:
        instruction = line.split(',')
        cur_state = instruction[0]
        read = instruction[1]
        write = instruction[2]
        move = instruction[3]
        next_state = instruction[4]

        actions[(cur_state, read)] = (write, move, next_state)
# While there is a valid action by tm rules, take it and record
# if not, then in "ending" state so return it.
    tape = right = input
    index = 0
    state = instructions[0].split(',')[0]
    left = ''

    while True:
        read = tape[index]
        action = actions.get((state, read))
        configurations.append((left, state, right))
        if actions.get((state, read)) is None:
            break

        
        tape = left + action[0] + right[1:]
        if (action[1] == 'L'):
            index -= 1
            right = left[-1] + action[0] + right[1:]
            left = tape[:index]
        if (action[1] == 'R'):
            index += 1
            left = left + action[0]
            right = right[1:]
            if index >= len(tape) - 1:
                tape = tape + '#'
        state = action[2]        
    
    return configurations
