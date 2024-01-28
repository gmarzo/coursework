Author: Garrett Marzo

================================================================================================================

Movie Query 1: awk -F, '$3 ~ / Z:/ && $1 % 3 == 0 { print }' movie_titles-utf8.csv

- Query movies with " Z:" in the title, and whose ID is divisible by 3 (to cut down on the size).

Result:

2895,2005,Dragon Ball Z: Bio-Broly

2928,2000,Dragon Ball Z: Captain Ginyu Saga

3012,2001,Dragon Ball Z: World Tournament

9669,2002,Dragon Ball Z: Kid Buu Saga

11052,2000,Dragon Ball Z: The History of Trunks

11589,1999,Dragon Ball Z: Great Saiyaman: Final Round

12219,2000,Dragon Ball Z: Vegeta Saga 1

14745,1998,Dragon Ball Z: The World's Strongest

15195,1999,Dragon Ball Z: Great Saiyaman: Gohan's Secret

15423,2003,Dragon Ball Z: Garlic Jr.

16434,1996,Dragon Ball Z: Bojack Unbound

17028,1998,Dragon Ball Z: Vol. 17: Super Saiyan

================================================================================================================

Movie Query 2: awk -F, '$2 >= 2002 && $2 <= 2003 && $3 ~ /^A / { print }' movie_titles-utf8.csv

- Query movies from 2002 to 2003 whose title starts with the word "A"

Result:

538,2003,A Crime of Passion

778,2003,A Touch of Frost: Seasons 7 & 8

1188,2002,A Little Inside

2254,2003,A Guy Thing

4080,2003,A Mighty Wind

4389,2003,A Man Apart

4730,2003,A Wrinkle in Time

6235,2002,A Walk to Remember

6688,2003,A Wedding for Bella

7011,2002,A Loving Father

7079,2003,A Painted House

8922,2003,A Family Affair

9155,2002,A Charlie Brown Valentine

9452,2002,A Season on the Brink

10694,2003,A Little Snow Fairy Sugar

11003,2003,A Certain Kind of Death

11610,2002,A Brilliant Madness: American Experience

11962,2002,A Midsummer Night's Rave

13527,2003,A Thousand Clouds of Peace

13730,2002,A Snake of June

14075,2002,A Rumor of Angels

14866,2003,A Woman Hunted

15641,2003,A Separate Peace

15781,2002,A Shot at Glory

16695,2003,A Decade Under the Influence

16811,2003,A Good Night to Die

================================================================================================================

User Query: awk -F, '$2 == 1772185 { print }' ratings.csv

- Search for ratings from user 1772185

Result (truncated):

13860,1772185,3,2005-10-13

13887,1772185,5,2005-10-21

13974,1772185,3,2005-10-21

14050,1772185,5,2005-10-21

14141,1772185,3,2005-10-21

14358,1772185,1,2005-10-21

14364,1772185,1,2005-10-21

14381,1772185,5,2005-10-21

14468,1772185,5,2005-10-21

14476,1772185,5,2005-10-21

14519,1772185,1,2005-10-21

14574,1772185,1,2005-10-13

14584,1772185,5,2005-10-21

- Many of this user's reviews tend to swing either to 1 or 5. Very extreme this one, also didn't rate "Spider-Man 2" and gave "Monty Python and the Holy Grail" a 1.

================================================================================================================

Review total query: python3 average_ratings.py 14358

- Get the average rating for "Monty Python and the Holy Grail"

Final Result: "Movie 14358 has an average rating of 4.173394289494513 over 84651 known ratings."

- Movie 14358 seems to be fairly well-liked with a large audience, significantly more than Warren Miller's impact.
