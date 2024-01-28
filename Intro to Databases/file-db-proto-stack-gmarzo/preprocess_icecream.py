import csv
import re
import sys

SOURCE = 'mcdonalds_dataset.csv'
COORD_PATTERN = '^\-?(\d+)\.(\d+)'
COORD = re.compile(COORD_PATTERN)

DESTINATION = 'icecream_broken_machines.csv'

processed_file = open(DESTINATION, 'w')

with open(SOURCE, 'r') as f:
    reader = csv.reader(f)
    for row in reader:
        if COORD.match(row[0]):
            processed_file.write(f'{row[8]}, {row[7]}, {row[5]}\n')

processed_file.close()