# Graph Database Design: Steam Reviews

## Schema Diagram

![Schema](/schema.png)

## Design Choices

- We chose to represent nodes in our graph as reviewers and Steam app ids, with connected edges representing a review given by a reviewer on an app.
  - **Reviewer:** Any given reviewer can be identified by their Steam ID. We also chose to include the total number of apps they have reviewed as well as the number of games they own on Steam, to see if there is any correlation between these values and their reviews.
  - **App:** Every app on Steam has a unique app ID. We also include the app name from the dataset.
  - **Reviewed:** This edge represents a review given by a reviewer on an app. Here we include information about the review, which allows us to compare the reviews of different reviewers on the same app.
- With this schema, we could visualize and analyze relationships in the data such as:
  - Do groups or clusters of reviewers tend to review the same types of games?
  - Do reviews with more reviewer playtime tend to be more positive?
  - Do reviewers with more reviews tend to be more or less positive overall?

## Dataset Loading Command Sequence

Ensure `steam_reviews.csv` is in the root of the project directory.
- Dataset link: https://www.kaggle.com/datasets/najzeko/steam-reviews-2021

Preprocess Steam Reviews Data:
`python preprocess_apps.py`
`python preprocess_reviewers.py`
`python preprocess_reviews.py`

Import Data into Neo4j:
`NEO4J_CONF=<absolute-path-to-neo4j-conf> neo4j-admin database import full --nodes=App="app_header.csv,steam_apps.csv" --nodes=Reviewer="reviewer_header.csv,steam_reviewers.csv" --relationships=REVIEWED="review_header.csv,steam_processed_reviews.csv" --id-type=STRING`

Run the Database:
`NEO4J_CONF=<path-to-neo4j-conf> neo4j console`