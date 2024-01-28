# Steam Review Queries

### 1. Get 10 reviews for a given app.

```
MATCH (app:App {appName: "Stardew Valley"})<-[:REVIEWED]-(reviewer:Reviewer)
RETURN app, reviewer
LIMIT 10
```

![Query 1 Result](/query-results/steam-query1.png)

### 2. Get 10 reviewers who have played at least 1 hour for a subset of apps.

```
MATCH (app1:App {appName: "Terraria"})<-[review1:REVIEWED]-(reviewer:Reviewer)-[review2:REVIEWED]->(app2:App {appName: "Stardew Valley"})
WHERE review1.playTime > 3600
AND review2.playTime > 3600
RETURN app1, reviewer, app2
LIMIT 10
```

![Query 2 Result](/query-results/steam-query2.png)

### 3. Get 10 negative reviews with a play time of over 10 hours of a given app, if any exist.

```
MATCH (app:App {appName: "Stardew Valley"})
OPTIONAL MATCH (app)<-[review:REVIEWED {recommended: false}]-(reviewer:Reviewer)
WHERE review.playTime > 36000
RETURN app, reviewer
LIMIT 10
```

![Query 3 Result](/query-results/steam-query3.png)

### 4. Get the top 10 apps with the highest number of positive reviews.

```
MATCH (app:App)<-[review:REVIEWED {recommended: true}]-(:Reviewer)
RETURN app.appName, count(review)
ORDER BY count(review) DESC
LIMIT 10
```

![Query 4 Result](/query-results/steam-query4.png)

### 5. Get the top 10 apps with the highest average play time by reviewers.

```
MATCH (app:App)<-[review:REVIEWED]-(:Reviewer)
RETURN app.appName, avg(review.playTime) AS averagePlayTime
ORDER BY avg(review.playTime) DESC
LIMIT 10
```

![Query 5 Result](/query-results/steam-query5.png)
