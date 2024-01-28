from api import find_coords
import asyncio
import math
import sys
import csv
import re

SOURCE = "mcdonalds_dataset.csv"
LAT_TO_MI = 69
LON_TO_MI = 54.6

COORD_PATTERN = "^\-?(\d+)\.(\d+)"
COORD = re.compile(COORD_PATTERN)

if (len(sys.argv) != 2):
    print("Usage: nearby_locations.py <address>")
    print("Example: nearby_locations.py '1 LMU Drive'")
    exit()

def get_distance(coords1, coords2):
    lat_distance = abs(float(coords1[0]) - float(coords2[0]))
    lon_distance = abs(float(coords1[1]) - float(coords2[1]))

    vert_miles = lat_distance * LAT_TO_MI
    horz_miles = lon_distance * LON_TO_MI

    return math.sqrt(vert_miles**2 + horz_miles**2)

def get_coords(address):
    place = find_coords(address)
    return place

address = sys.argv[1]
coords = get_coords(address)

with open(SOURCE, "r") as f:
    reader = csv.reader(f)
    for row in reader:
        if COORD.match(row[0]):
            distance = get_distance(coords, [row[0], row[1]])
            if get_distance(coords, [row[0], row[1]]) < 3:
                print(*row)


