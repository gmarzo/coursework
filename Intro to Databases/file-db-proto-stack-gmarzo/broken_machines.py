import csv
import re
import sys

SOURCE = 'mcdonalds_dataset.csv'
COORD_PATTERN = '^\-?(\d+)\.(\d+)'
COORD = re.compile(COORD_PATTERN)

with open(SOURCE, 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        lon_match = COORD.match(row[0])
        if lon_match and row[3] == 'True':
            print(*row)