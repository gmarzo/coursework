# File to load database on steam users.

import csv
import sys
import time

maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

SOURCE = 'steam_reviews.csv'

DESTINATION = 'steam_processed_reviews.csv'
post_processed_file = open(
    DESTINATION, 'w', encoding='utf-8', errors='replace')

# Review format: ['697', '292030', 'The Witcher 3: Wild Hunt', '85046824', 'polish', 'sztos, wiedźmin jedna z najładniejszych gier w jakie grałem', '1611167751', '1611167751', 'True', '0', '0', '0.0', '0', 'True', 'False', 'False', '76561199013021206', '41', '25', '514.0', '424.0', '514.0', '1610887107.0']
#               [Index (0), Steam app Id (1), App Name (2), Review Id (3), Language (4), Review (5), Timestamp Created (6), Timestamp Updated (7), Recommended (8), Votes Helpful (9), Votes Funny (10), Weighted Vote Score (11), Comment Count (12), Steam Purchase (13), Received For Free (14), Written During Early Access (15), Author Steam Id (16), Author Num Games Owned (17), Author Num Reviews (18), Author Playtime Last Two Weeks (19), Author Playtime At Review (20), Author Playtime Total (21), Author Last Played (22)]
print(f'Processing reviews from {SOURCE}')

with open(SOURCE, 'r+', encoding='utf8') as f:
    reader = csv.reader(f)
    next(reader)

    for row in reader:
        # Only processing English reviews
        if row[4] != 'english':
            continue

        steamId, appId, reviewId, reviewText, timeCreated, timeUpdated, recommended, playTime = row[
            16], row[1], row[3], row[5], row[6], row[7], row[8].lower(), row[21]

        reviewText = reviewText.replace("'", "").replace("\"", "").replace("\n", "").replace("\\.", ".").replace(
            "\t", "").replace("\r", "").replace("\u000A", "LF").replace("\\", "\\\\").replace(",", ";")

        # Here because playTime has a random ".0" on the end
        playTime = playTime[:-2]

        review_line = ','.join(
            [steamId, appId, reviewId, reviewText, timeCreated, timeUpdated, recommended, playTime])

        post_processed_file.write(f'{review_line}\n')

print(f'Done processing reviews!')
print(f'Processed reviews written to {DESTINATION}')
post_processed_file.close()
