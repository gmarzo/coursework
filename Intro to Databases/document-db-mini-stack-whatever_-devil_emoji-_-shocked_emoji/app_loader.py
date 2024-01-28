import csv
import sys
import json

maxInt = sys.maxsize

while True:
    try:
        csv.field_size_limit(maxInt)
        break
    except OverflowError:
        maxInt = int(maxInt/10)

csv.field_size_limit(maxInt)

"""
This program generates direct JSON literals from the source Steam Review files.
This allows us to pass the data directly into a `mongoimport`.

Upon completion, we will have a collection of apps.

Usage: python app_loader.py | mongoimport --db steam_reviews --collection apps --drop --host=localhost
"""

# For simplicity, we assume that the program runs where the files are located.
APP_SOURCE = 'steam_reviews.csv'

# Helper function for sending app updates.


def print_app(app_id, app_name):
    print(json.dumps({
        'app_id': app_id,
        'app_name': app_name
    }))


with open(APP_SOURCE, 'r+', encoding='utf-8') as f:
    reader = csv.reader(f)
    # dicts don't allow duplicate keys by default
    app_names = {row[1]: row[2] for row in reader if row[4] == 'english'}

    for (app_id, app_name) in app_names.items():
        print_app(app_id, app_name)
