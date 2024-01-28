# Netflix Practice Queries

### 1. Create artists with common properties and relationships with movies they made. Return all said relationships and nodes.

Create nodes for Hans Zimmer, Willem Dafoe, Christian Bale, Tom Cruise, and Kelly McGillis; then connect them to movies that they have worked on.

Artist Creation clauses:

```
CREATE (a:Artist {name: "Hans Zimmer", gender: "Male", birthday: "09-12-1957", nationality: "German"})

CREATE (a:Artist {name: "Willem Dafoe", gender: "Male", birthday: "07-22-1955", nationality: "American"})

CREATE (a:Artist {name: "Christian Bale", gender: "Male", birthday: "01-30-1974", nationality: "English"})

CREATE (a:Artist {name: "Tom Cruise", gender: "Male", birthday: "07-03-1962", nationality: "American"})

CREATE (a:Artist {name: "Kelly McGillis", gender: "Female", birthday: "07-09-1957", nationality: "American"})

```

Relationship creation clauses:

```
MATCH (a:Artist {name: "Hans Zimmer"}), (m:Movie {movieId: "14648"})
CREATE (a)-[:COMPOSED_FOR]->(m)

MATCH (a:Artist {name: "Hans Zimmer"}), (m:Movie {movieId: "3079"})
CREATE (a)-[:COMPOSED_FOR]->(m)

MATCH (a:Artist {name: "Hans Zimmer"}), (m:Movie {movieId: "3864"})
CREATE (a)-[:COMPOSED_FOR]->(m)

MATCH (a:Artist {name: "Hans Zimmer"}), (m:Movie {movieId: "12047"})
CREATE (a)-[:COMPOSED_FOR]->(m)

MATCH (a:Artist {name: "Willem Dafoe"}), (m:Movie {movieId: "14648"})
CREATE (a)-[:VOICED_IN]->(m)

MATCH (a:Artist {name: "Willem Dafoe"}), (m:Movie {movieId: "4109"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Willem Dafoe"}), (m:Movie {movieId: "14410"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Christian Bale"}), (m:Movie {movieId: "3864"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Christian Bale"}), (m:Movie {movieId: "4109"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Tom Cruise"}), (m:Movie {movieId: "7624"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Tom Cruise"}), (m:Movie {movieId: "16668"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Tom Cruise"}), (m:Movie {movieId: "12047"})
CREATE (a)-[:ACTED_IN]->(m)

MATCH (a:Artist {name: "Kelly McGillis"}), (m:Movie {movieId: "7624"})
CREATE (a)-[:ACTED_IN]->(m)
```

All entered relationships
![Query 1 Result](/query-results/neo4j-q1.png)

### 2. Viewers who have given a 5 to the work of our chosen artist

Find 10 viewers that gave a 5 to a movie that Willem Dafoe was in, "Finding Nemo (Full-Screen)"

```
MATCH (v:Viewer)-[r1: RATED {rating: 5}]->(m:Movie {movieId: "14648"})<-[r2]-(a:Artist {name: "Willem Dafoe"})
RETURN v, r1, m, r2, a
LIMIT 10
```

![Query Result 2](/query-results/neo4j-q2.png)

### 3. Viewers that hated one movie (rated 1) and loved another (rated 5)

Return the viewers, movies, and ratings that have "Star Wars: Episode IV: A New Hope" rated a 1 and have "Star Wars: Episode II: Attack of the Clones" rated a 5.

```
MATCH (m1:Movie)<-[r1:RATED {rating: 1}]-(v:Viewer)-[r2:RATED {rating: 5}]->(m2:Movie)
WHERE m1.title CONTAINS "Episode IV" AND m2.title CONTAINS "Episode II"
RETURN m1, m2, r1, r2, v
```

![Query 3 Result](/query-results/neo4j-q3.png)

### 4. Make a small subset of movies/shows (3 at max) and return all viewers that rated at least one of those on a particular day.

Return 10 viewers that watched both "Spider-Man" and "Spider-Man 2" on March 27, 2005.

```
MATCH (m1:Movie {movieId: "14410"})<-[r1:RATED {dateRated: date("2005-03-27")}]-(v:Viewer)-[r2:RATED {dateRated: date("2005-03-27")}]->(m2:Movie {movieId: "12155"})
RETURN m1, r1, v, r2, m2
LIMIT 10
```

![Query 4 Result](/query-results/neo4j-q4.png)

### 5. Filter a small subset of artists (that we've loaded). Show viewers that rated a show/movie on the same day, for a show/movie that your chosen artists worked on. Return viewers, movies/shows, chosen artists, artists contribution.

Return the artists that worked on the movie "Top Gun" and thier contributions, as well as viewers that watched "Top Gun" on November 8, 2002.

```
MATCH(v:Viewer)-[r1:RATED {dateRated: date("2002-11-08")}]->(m:Movie{movieId: "7624"})<-[r]-(a:Artist)
RETURN v, r1, m, r, a
```

![Query 5 Result](/query-results/neo4j-q5.png)
