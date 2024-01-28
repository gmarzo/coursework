import csv
import json
import sys

maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

csv.field_size_limit(maxInt)

"""
This program generates direct JSON literals from the source Steam Reviews files.
This allows us to pass the data directly into a `mongoimport`.

Upon completion, we will have a collection of reviews.

Usage: python review_loader.py | mongoimport --db steam_reviews --collection reviews --drop --host=localhost
"""

# For simplicity, we assume that the program runs where the files are located.
REVIEW_SOURCE = 'steam_reviews.csv'


# Helper function for sending review updates.
def print_review(review_id, app_id, review_text, recommended, upvotes, language, time_created, time_updated):
    review_text = review_text.replace("'", "''").replace("\n", "\\n").replace("\\.", ".").replace(
        "\t", "\\t").replace("\r", "\\r").replace("\u000A", "LF").replace("\\", "\\\\")
    print(json.dumps({
        'review_id': review_id,
        'app_id': app_id,
        'review_text': review_text,
        'recommended': recommended.lower() == 'true',
        'upvotes': upvotes,
        'language': language,
        'time': {
          'time_created': time_created,
          'time_updated': time_updated
          }
    }))


with open(REVIEW_SOURCE, 'r+', encoding='utf-8') as f:
    reader = csv.reader(f)
    for row in reader:
        app_id, [review_id, language, review_text, time_created,
                 time_updated, recommended, upvotes] = row[1], row[3:10]
        if language == 'english':
            print_review(review_id, app_id, review_text, recommended,
                         upvotes, language, time_created, time_updated)
