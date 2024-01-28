**CMSI 3520** Database Systems, Fall 2022

# A Note on Character Encoding
### Or, why Computer Systems Organization is a required course 🧐
This supplement is written out as a separate document because, although its content may well be an integral part of your workflow with dataset files, in the greater scheme of things this can actually be considered “prior knowledge” because you should have already seen this in the Computer Systems Organization course. Specifically, this is about _character encoding_.

## TL;DR
To UTF-8, or not to UTF-8…there is _no_ question.

## The reality is…
The rest of the world, unfortunately, is not as savvy to character encoding as we would prefer. People will gather data from whatever sources they are using and they will rarely be fully conscious of how their datasets are encoded. Netflix circa 2007, when the Netflix Prize Dataset was released, is no exception.

As proto-database professionals, it’s important to retain our knowledge and awareness of character encoding, and be prepared to deal with such issues if we encounter them.

Like the TL;DR said, the main takeaway is: as much as possible, work in UTF-8. If you encounter data that isn’t encoded in UTF-8, seek to convert it first so that you don’t have to deal with encoding issues further down the pipeline.

## Netflix Case Study Spinoff: Encoding Edition
There is a good chance that issuing this command on _movie_titles.csv_ will yield the following results for you:

    $ grep "Smokey" movie_titles.csv
    168,1983,Smokey and the Bandit Part 3
    6483,2001,Smokey Joe's Caf?
    6804,1977,Smokey and the Bandit / Smokey and the Bandit II: Double Feature
    9969,1998,Smokey Robinson: The Greatest Hits Live

See anything wrong there? If nothing jumps at you, focus on the movie whose ID is `6483`:

    6483,2001,Smokey Joe's Caf?

Chances are unlikely that there was a 2001 movie that asks a question about “Smokey Joe’s Caf.” However, there _is_ a Broadway musical called [Smokey Joe’s Café—The Songs of Leiber and Stoller](https://www.youtube.com/watch?v=yS_tUzN4IYg), and it’s highly possible that Netflix had some kind of 2001 adaptation of that on their catalog.

So what’s going on here? If you look up “Smokey Joe’s Café” on the web, you’ll notice that many of the search hits do _not_ have the accent on top of the last “e.” They spell it “Smokey Joe’s Cafe” (“cafe” as in “waif?” Never heard of such a place!)—this is indicative of the ongoing deficiencies that the world has with character encoding.

### So fé-ing what?
You might go, “that’s a single character, people will be fine.” Or maybe you might say, “not a problem, people know that ‘café’ can be spelled ‘cafe’ these days.” Yes, people can deal with this, but not necessarily your software.

Worst-case scenario might actually be that your software ignores the issue, so you’ll never know it’s there. Your version of `grep` may be one of those—it blithely searches through _movie_titles.csv_ without a care, producing the results seen above.

If that happens…well…you may one day end up with applications that have “weird characters” on them. Annoying at the least, right? But if you’re issuing queries and expecting certain results, the problem may be greater because then your application won’t show accurate information. To wit:

    grep "Smokey Joe's Cafe" movie_titles.csv

-or-

    grep "Smokey Joe's Café" movie_titles.csv

Try ’em and consider whether your prospective application users would appreciate the results.

### It’s a diversity and inclusivity issue as well
For some of us, the issue hits more personally: some of us have names that don’t fit the previously narrow view of character sets that early systems had, and as a result we are forced to spell our names inaccurately. Take Prof. Luís Proença from the School of Film & Television—how would you feel if your own university’s website [can’t represent your name accurately](https://sftv.lmu.edu/faculty/?expert=luis.proenca)? Heck, even [IMDB can’t get it right](https://www.imdb.com/name/nm4774985). But when he can work with someone who can handle the truth, he will have [his name written](https://youtu.be/W8tXwYBZVAg?t=70) as it is [meant to be](https://youtu.be/zS4y-BsPIQM?t=4).

I’ve met Prof. Proença and he is quite chill and wise about the world. It’s probably not a big deal to him (anymore?). However, why does he have to compromise, especially when Unicode and UTF-8 can address this perfectly fine today…_if only people gave a_ 💩.

If your name, or the name of someone you know, is forced to change an é, í, ç, ñ, or other true character with a plain e, i, c, n, etc.—please remember that this is a _solved problem_. It’s just that too few people in this field remain unaware of it or refuse to take the time to address it. If you avoid being one of those, we will improve the state of the world by a notch.

### Some versions of `awk` will be unhappy
OK, back off the soapbox—for some of you, following the [Netflix file case study](./README.md) exactly as written might not go as expected, particularly for certain versions of `awk`:

    $ awk -F, '$3 ~ /^You / { print }' movie_titles.csv
    1327,1937,You Only Live Once
    1738,2004,You I Love
    3006,2004,You Got Served: Take it to the Streets
    5731,1938,You Can't Take It With You
    6213,1950,You Bet Your Life
    awk: towc: multibyte conversion failure on: '?'
    
     input record number 6483, file movie_titles.csv
     source line number 1

Surprise surprise, the problem line is 6483…the one with `6483,2001,Smokey Joe's Caf?` (according to `grep`).

If you encounter this, that’s actually a good thing: it alerts you to a dataset encoding glitch that should be fixed as early in the workflow as possible.

### Back to UTF-8: How to fix it
The good news is that the solution is easy: most modern operating systems have a built-in character encoding converter, called [`iconv`](https://man7.org/linux/man-pages/man1/iconv.1.html). `iconv` has built-in knowledge of many encodings, and can flat-out change files from one encoding to another.

What it does need to know are the _source_ and _destination_ encodings. We know the destination: it’s UTF-8! But what is the source? If you’re lucky, the documentation of your dataset will just say what it is. But if not, this is where a little more Computer Systems Organization content comes in handy: just look at the bytes 🔍

We can use the [`hexdump`](https://man7.org/linux/man-pages/man1/hexdump.1.html) program (you remember that from Computer Systems Organization, maybe? 🤞🏽) to inspect the actual bytes on that line:

    $ grep "Smokey Joe" movie_titles.csv | hexdump -C
    00000000  36 34 38 33 2c 32 30 30  31 2c 53 6d 6f 6b 65 79  |6483,2001,Smokey|
    00000010  20 4a 6f 65 27 73 20 43  61 66 e9 0a              | Joe's Caf?.|
    0000001c

(note the use of `|` again here, to send the data from `grep` into `hexdump`)

If you follow the bytes, you’ll see that the `?` character is actually the byte `e9`. That is indeed valid Unicode but _it isn’t encoded the way UTF-8 would encode it_ (cue a review of UTF-8 encoding rules). So what older encoding writes out `é` as `e9`? This part requires some detective work but the answer can be found with some research: [ISO-8859-1](https://en.wikipedia.org/wiki/ISO/IEC_8859-1) is one such encoding, and a likely one due to its use as an earlier standard (scroll down to the table and look up row `Ex` column `9`.

With the source encoding known, the `iconv` command is now also known:

    iconv -c -f iso-8859-1 -t utf8 movie_titles.csv

This will output the entire _movie_titles.csv_ file as UTF-8. What remains is how we can use this output…

### Pick up the `|` or learn some `>`
We can use the `iconv` output in lots of ways! Here are some out of the box:
* You can “feed” the `iconv` output into `grep` with our trusty `|` operator, and all will be well (note the filename now disappears from the `grep` command because we want `grep` to take what `iconv` gives it instead):

        $ iconv -c -f iso-8859-1 -t utf8 movie_titles.csv | grep "Smokey"
        168,1983,Smokey and the Bandit Part 3
        6483,2001,Smokey Joe's Café
        6804,1977,Smokey and the Bandit / Smokey and the Bandit II: Double Feature
        9969,1998,Smokey Robinson: The Greatest Hits Live

* This also eliminates the `awk`(ward) error seen earlier—even if “Smokey Joe’s Café” wasn’t involved there, the presence of the bad encoding did prevent `awk` from finishing the file:

        $ iconv -c -f iso-8859-1 -t utf8 movie_titles.csv | awk -F, '$3 ~ /^You / { print }'
        1327,1937,You Only Live Once
        1738,2004,You I Love
        3006,2004,You Got Served: Take it to the Streets
        5731,1938,You Can't Take It With You
        6213,1950,You Bet Your Life
        12468,1977,You Light Up My Life
        12904,1967,You Only Live Twice
        13565,2004,You Got Served
        13840,2000,You Can Count on Me
        14379,1942,You Were Never Lovelier
        15254,2000,You Are Here

This is all great, but as you may have noticed, this performs the conversion _every single time_. In the long run, you’ll probably want to _save_ the conversion just once and use that new file instead of the original, not-UTF-8-encoded _movie_titles.csv_. For this, we introduce another command line directive: the `>` character! As its visual might imply, this directive sends a program’s output to a new file:

    iconv -c -f iso-8859-1 -t utf8 movie_titles.csv > movie_titles-utf8.csv

After that, use _movie_titles-utf8.csv_ for all other operations!

    grep "Smokey" movie_titles-utf8.csv

-or-

    awk -F, '$3 ~ /^You / { print }' movie_titles-utf8.csv

…etc.

## In Summary
This may seem like a lot, but in many ways this should be mostly a review and application of the character encoding portion from Computer Systems Organization. That wasn’t solely about emoji 🤓

The bottom lines are these:
* Be cognizant that you might encounter character encoding issues in a dataset
* Address these issues by standardizing on UTF-8
* There are many tools available (including but not only `iconv`) that make this a no-brainer—be aware of some of them and know how to use them

And you thought you were done with that class. Hrmph 😤

This concludes our trip down Computer Systems Organization memory lane. Now back to [working with your dataset](./README.md)!
