- Author: Garrett Marzo

1. I think the last one was the most difficult to implement, but that may be because I didn't quite understand what was being asked.

2. The size of the files makes a difference on the time it takes to process, but the dataset I chose may have been too small to make a significant difference in time.

   - time grep ", Los Angeles" mcdonalds_dataset.csv
     real 0m0.034s
     user 0m0.029s
     sys 0m0.002s

   - time grep "Las Vegas" icecream_broken_machines.csv
     real 0m0.016s
     user 0m0.010s
     sys 0m0.003s

3. The complexity of the operations would scale with the size of the file for time. Putting a nested for-loop is not necessarily complex, but would be much slower.
