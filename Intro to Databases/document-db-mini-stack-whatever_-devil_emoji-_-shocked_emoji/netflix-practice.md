# Netflix Practice Queries

## 1. Get all movies with "heart" in the title in or after 2000 sorted by year

Query:

```js
db.movies
  .find({ title: /heart/, year: { $gte: 2000 } }, { _id: 0, title: 1, year: 1 })
  .sort({ year: 1 });
```

Output:

```json
[
  { "title": "Dragonheart: A New Beginning", "year": 2000 },
  { "title": "America's Sweethearts", "year": 2001 },
  { "title": "Matthew Blackheart: Monster Smasher", "year": 2001 }
]
```

## 2. Get the number of movies beginning with "The" per year

Query:

```js
db.movies.aggregate([
  { $match: { title: /^The/ } },
  { $group: { _id: '$year', numMovies: { $sum: 1 } } },
  { $sort: { _id: 1 } },
  { $project: { _id: 0, year: '$_id', numMovies: 1 } },
]);
```

Output:

```json
[
  { "numMovies": 1, "year": 1915 },
  { "numMovies": 1, "year": 1917 },
  { "numMovies": 1, "year": 1919 },
  { "numMovies": 2, "year": 1920 },
  { "numMovies": 4, "year": 1921 },
  { "numMovies": 1, "year": 1923 },
  { "numMovies": 2, "year": 1924 },
  { "numMovies": 3, "year": 1925 },
  { "numMovies": 1, "year": 1926 },
  { "numMovies": 3, "year": 1927 },
  { "numMovies": 5, "year": 1928 },
  { "numMovies": 3, "year": 1929 },
  { "numMovies": 1, "year": 1930 },
  { "numMovies": 2, "year": 1932 },
  { "numMovies": 3, "year": 1933 },
  { "numMovies": 6, "year": 1934 },
  { "numMovies": 4, "year": 1935 },
  { "numMovies": 5, "year": 1936 },
  { "numMovies": 5, "year": 1937 },
  { "numMovies": 7, "year": 1938 }
]
```

## 3. Get the top 5 years in the 20th century with the most movies released that begin with A, sorted by count (descending) and year (ascending)

Query:

```js
db.movies.aggregate([
  { $match: { title: /^A/, year: { $gte: 1900, $lte: 1999 } } },
  { $group: { _id: '$year', numMovies: { $sum: 1 } } },
  { $sort: { numMovies: -1, _id: 1 } },
  { $limit: 5 },
  { $project: { _id: 0, year: '$_id', numMovies: 1 } },
]);
```

Output:

```json
[
  { "numMovies": 48, "year": 1999 },
  { "numMovies": 34, "year": 1998 },
  { "numMovies": 30, "year": 1997 },
  { "numMovies": 24, "year": 1996 },
  { "numMovies": 20, "year": 1995 }
]
```

## 4. Get the title, year, and rating of movies reviewed by user 416217 with a rating of 4 or higher sorted by title

Query:

```js
db.movies.aggregate([
  { $unwind: '$ratings' },
  {
    $match: {
      'ratings.viewer_id': 416217,
      'ratings.rating': { $gte: 4 },
    },
  },
  {
    $project: {
      _id: 0,
      title: 1,
      year: 1,
      rating: '$ratings.rating',
    },
  },
  { $sort: { title: 1 } },
]);
```

Output:

```json
[
  { "title": "50 First Dates", "year": 2004, "rating": 4 },
  { "title": "Along Came a Spider", "year": 2001, "rating": 4 },
  { "title": "Basic", "year": 2003, "rating": 4 },
  { "title": "Big Fish", "year": 2003, "rating": 4 },
  { "title": "Blade: Trinity", "year": 2004, "rating": 4 },
  { "title": "Coupling: Season 1", "year": 2000, "rating": 5 },
  { "title": "Daddy Day Care", "year": 2003, "rating": 4 }
]
```

## 5. Get the top 5 movies with the highest average rating in 2004, sorted by average rating (descending) and title (ascending)

Query:

```js
db.movies.aggregate([
  { $unwind: '$ratings' },
  { $match: { year: 2004 } },
  {
    $group: {
      _id: '$_id',
      title: { $first: '$title' },
      year: { $first: '$year' },
      avgRating: { $avg: '$ratings.rating' },
    },
  },
  { $sort: { avgRating: -1, title: 1 } },
  { $limit: 5 },
  { $project: { _id: 0, title: 1, year: 1, avgRating: 1 } },
]);
```

Output:

```json
[
  {
    "title": "Lost: Season 1",
    "year": 2004,
    "avgRating": 4.6709891019450955
  },
  {
    "title": "Battlestar Galactica: Season 1",
    "year": 2004,
    "avgRating": 4.638809387521466
  },
  {
    "title": "Arrested Development: Season 2",
    "year": 2004,
    "avgRating": 4.582389367165081
  },
  {
    "title": "The Sopranos: Season 5",
    "year": 2004,
    "avgRating": 4.534334458014541
  },
  {
    "title": "Family Guy: Freakin' Sweet Collection",
    "year": 2004,
    "avgRating": 4.5160067816894385
  }
]
```

## 6. Get all movies with a title containing "heart" with an average rating of 3.5 or higher, sorted descending by average rating and ascending by title

Query:

```js
db.movies.aggregate([
  { $unwind: '$ratings' },
  { $match: { title: /heart/ } },
  {
    $group: {
      _id: '$_id',
      title: { $first: '$title' },
      year: { $first: '$year' },
      avgRating: { $avg: '$ratings.rating' },
    },
  },
  { $match: { avgRating: { $gte: 3.5 } } },
  { $sort: { avgRating: -1, title: 1 } },
  { $project: { _id: 0, title: 1, year: 1, avgRating: 1 } },
]);
```

Output:

```json
[
  { "title": "Braveheart", "year": 1995, "avgRating": 4.294422607502894 },
  {
    "title": "Mickey & Minnie's Sweetheart Stories",
    "year": 1950,
    "avgRating": 3.623342175066313
  },
  { "title": "Dragonheart", "year": 1996, "avgRating": 3.6120080436656132 }
]
```

## 7. Get the number of reviews published in or after 1990 for each movie with "heart" in the title, sorted descending by number of reviews

Query:

```js
db.movies.aggregate([
  { $unwind: '$ratings' },
  { $match: { title: /heart/, year: { $gte: 1990 } } },
  {
    $group: {
      _id: '$_id',
      title: { $first: '$title' },
      year: { $first: '$year' },
      count: { $sum: 1 },
    },
  },
  { $sort: { count: -1 } },
  { $project: { _id: 0, title: 1, year: 1, count: 1 } },
]);
```

Output:

```json
[
  { "title": "Braveheart", "year": 1995, "count": 135601 },
  { "title": "America's Sweethearts", "year": 2001, "count": 36030 },
  { "title": "Dragonheart", "year": 1996, "count": 17405 },
  { "title": "Lionheart", "year": 1990, "count": 5520 },
  { "title": "Thunderheart", "year": 1992, "count": 4215 },
  { "title": "Dragonheart: A New Beginning", "year": 2000, "count": 3967 },
  {
    "title": "Matthew Blackheart: Monster Smasher",
    "year": 2001,
    "count": 219
  }
]
```
