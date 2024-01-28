import csv
import re
import sys

SOURCE = 'mcdonalds_dataset.csv'
COORD_PATTERN = '^\-?(\d+)\.(\d+)'
COORD = re.compile(COORD_PATTERN)

if (len(sys.argv) != 2):
    print('Usage: get_working.py <city_name>')
    print('Example: get_working.py "New York"')
    exit()

query_city = sys.argv[1]

with open(SOURCE, 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        if COORD.match(row[0]) and row[7] == query_city:
            print(f'{row[8]}, {row[7]}, {row[5]}')
