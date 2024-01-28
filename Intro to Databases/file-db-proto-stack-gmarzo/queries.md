- Author: Garrett Marzo

=======================================================================================

Query by pure command: grep ",Los Angeles" mcdonalds_dataset.csv

- Locate all McDonald's locations in Los Angeles

Result (truncated):

-118.175911,34.087677,0,False,True,working,CA,Los Angeles,4947 Huntington Dr,USA,Checked 127 minutes ago

-118.173431,34.059719,0,False,False,inactive,CA,Los Angeles,1617 N Eastern Avenue,USA,Checked 127 minutes ago

-118.201527,34.104948,0,False,True,working,CA,Los Angeles,5008 N Figueroa St,USA,Checked 127 minutes ago

-118.208717,34.074116,0,False,True,working,CA,Los Angeles,3105 N Broadway,USA,Checked 128 minutes ago

-118.222832,34.083157,0,False,True,working,CA,Los Angeles,2224 N Figueroa St,USA,Checked 127 minutes ago

-118.212257,34.058479,0,False,True,working,CA,Los Angeles,1716 Marengo St,USA,Checked 127 minutes ago

-118.208504,34.04631,0,False,True,working,CA,Los Angeles,245 N Soto St,USA,Checked 129 minutes ago

-118.246658,34.115196,0,False,True,working,CA,Los Angeles,3124 San Fernando,USA,Checked 127 minutes ago

-118.199295,34.026688,0,False,True,working,CA,Los Angeles,3458 Whittier Blvd,USA,Checked 129 minutes ago

-118.219254,34.027588,0,False,True,working,CA,Los Angeles,1210 S Soto St,USA,Checked 129 minutes ago

-118.260628,34.080608,0,False,True,working,CA,Los Angeles,1417 Glendale Blvd,USA,Checked 128 minutes ago

-118.238154,34.035304,0,False,True,working,CA,Los Angeles,690 Alameda St,USA,Checked 129 minutes ago

-118.244026,34.031433,0,False,True,working,CA,Los Angeles,1310 E Olympic Blvd,USA,Checked 129 minutes ago

-118.26815,34.070595,0,False,True,working,CA,Los Angeles,405 N Alvarado St,USA,Checked 129 minutes ago

-118.284004,34.09531,0,False,True,working,CA,Los Angeles,4348 Sunset Blvd,USA,Checked 129 minutes ago

-118.270819,34.05596,0,False,True,working,CA,Los Angeles,1625 W Wilshire Blvd,USA,Checked 129 minutes ago

=======================================================================================

Count query by pure command: grep ",Los Angeles" mcdonalds_dataset.csv | wc

- Get the number of locations in Los Angeles

RESULT:
60 466 6309

=======================================================================================

Query by a program that scans the data file(s): python3 broken_machines.py

- Print the row (unpacked) if the column is_broken is True

Result (truncated):

7.63489204 51.95743055 0 True True broken Münster Berliner Platz 25 DE Checked 31 minutes ago

7.72268449 47.97115824 0 True True broken Schallstadt An der A5 DE Checked 31 minutes ago

11.80930675 50.87567565 0 True True broken Mörsdorf Teufelstalweg 9 DE Checked 31 minutes ago

7.22607615 50.4401465 0 True True broken Niederzissen An der A61 DE Checked 31 minutes ago

12.70535293 48.93146962 0 True True broken Hunderdorf Sollach 9 DE Checked 31 minutes ago

13.09454275 54.3010531 0 True True broken Stralsund Greifswalder Chaussee 123 DE Checked 31 minutes ago

9.92102874 51.62916168 0 True True broken Nörten-Hardenberg Unter dem Pferdestiege 2 DE Checked 31 minutes ago

10.3974476 52.1890676 0 True True broken Salzgitter Schachtblick 0 DE Checked 31 minutes ago

10.1266032 48.2195583 0 True True broken Illertissen Leitschäcker 4 DE Checked 31 minutes ago

12.2323169 54.0242738 0 True True broken Dummerstorf Manfred-Roth-Straße 4 DE Checked 31 minutes ago

10.1835192 51.0060407 0 True True broken Herleshausen RS Werratal (A4) DE Checked 31 minutes ago

=================================================================

Query by pure command facilitated by pre-processing: python3 nearby_locations.py "1 lmu drive" | grep "Los Angeles"

- Print rows of locations in Los Angeles within 3 miles of LMU.

Result:

-118.386113 33.959622 0 False True working CA Los Angeles 5908 W Manchester Ave USA Checked 130 minutes ago

-118.439341 33.981223 0 False True working CA Los Angeles 4680 Lincoln Blvd USA Checked 131 minutes ago

=======================================================================================

"Compound" query that requires a manual combination of commands or programs: python3 get_working.py "Las Vegas"

- Print all locations in a city that have the ice cream machine working

Result:

6680 E Lake Mead Blvd, Las Vegas, working

5811 E Charleston Blvd, Las Vegas, working

2886 S Nellis Blvd, Las Vegas, working

4400 E Charleston, Las Vegas, working

5111 Boulder Hwy, Las Vegas, working

5198 Boulder Highway, Las Vegas, working

4934 Boulder Hwy, Las Vegas, working

3500 E Bonanza, Las Vegas, working

3020 Edesert Inn Rd, Las Vegas, working

3229 E Tropicana Ave, Las Vegas, working

301 Fremont Street, Las Vegas, working

1501 W Lake Mead, Las Vegas, working

Sahara Maryland, Las Vegas, working

2550 E Sunset Rd, Las Vegas, working

2000 S Las Vegas Blvd, Las Vegas, working

2248 Paradise Rd, Las Vegas, working

1601 W Charleston Blvd, Las Vegas, working

4855 S Maryland Pky, Las Vegas, working

4804 W Lone Mountain, Las Vegas, working

2851 W Washington, Las Vegas, working

3700 S Paradise Rd, Las Vegas, working

8120 S Eastern, Las Vegas, working

2650 W Sahara, Las Vegas, working

3175 N Rancho, Las Vegas, working

3717 S Las Vegas Blvd, Las Vegas, working

7171 W Ann Rd, Las Vegas, working

4774 Alta Dr, Las Vegas, working

1343 Silverado Ranch, Las Vegas, working

Sahara Arville, Las Vegas, working

7150 W Craig Rd, Las Vegas, working

3451 W Tropicana, Las Vegas, working

8480 Farm Rd, Las Vegas, working

108 N Jones Blvd, Las Vegas, working

7310 S Las Vegas Blvd, Las Vegas, working

2020 N Rainbow, Las Vegas, working

8425 West Centennial, Las Vegas, working

4945 W Flamingo Rd, Las Vegas, working

6360 W Charleston, Las Vegas, working

5947 Spring Mountain Rd, Las Vegas, working

9760 S. Las Vegas Blvd., Las Vegas, working

7662 W Lake Mead, Las Vegas, working

7530 W Washington, Las Vegas, working

2340 S Rainbow, Las Vegas, working

6020 W Tropicana, Las Vegas, working

8620 W Cheyenne Ave, Las Vegas, working

7851 W Charleston, Las Vegas, working

4075 S Buffalo Dr, Las Vegas, working

6990 S Rainbow Road, Las Vegas, working

900 S Rampart, Las Vegas, working

1980 Village Center, Las Vegas, working

8635 W Spring Mountain, Las Vegas, working

4135 South Grand Canyon Drive, Las Vegas, working
