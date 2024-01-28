import neo4j, { QueryResult } from 'neo4j-driver';
import { Dict } from 'neo4j-driver-core/types/record';

const dbUser = process.env.DB_USER || 'neo4j';

const db = neo4j.driver(
  process.env.DB_URL || 'bolt://localhost:7687',
  neo4j.auth.basic(dbUser, process.env.DB_PASSWORD || 'neo4j')
);

/**
 * Given an app name, return the app id
 * @param appName the name of the app to get the id for
 * @returns the app id for the given app name
 */
export const getAppId = async (appName: string) => {
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (app:App {appName: $appName})
       RETURN app.appId`,
      { appName }
    );
  } finally {
    await session.close();
  }

  return result?.records[0]
  ? result.records[0].get('app.appId')
  : `No app found with name ${appName}`;
};

/**
 * Get the reviews for a given app by app name
 * @param appName the app name of the app to get reviews for
 * @param limit the maximum number of reviews to return
 * @returns the reviews for the given app
 * 
 * example query:
MATCH (:App {appName: "Stardew Valley"})<-[review:REVIEWED]-(:Reviewer)
RETURN review.reviewText
ORDER BY review.timeCreated
LIMIT 5
 */
export const getReviewsForApp = async (appName: string, limit: number) => {
  limit = isNaN(limit) ? 5 : limit;
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:App {appName: $appName})<-[review:REVIEWED]-(:Reviewer)
       RETURN review.reviewText
       ORDER BY review.timeCreated
       LIMIT $limit`,
      { appName, limit: neo4j.int(limit) }
    );
  } finally {
    await session.close();
  }

  return result 
  ? result.records.map(record => record.get('review.reviewText'))
  : [];
};

/*
==============================
  FEATURED QUERY FUNCTIONS
==============================
*/

/**
 * Given a steamId, find apps to recommend to the user based on what similar users have reviewed
 * @param steamId the steamId of the user to find recommendations for
 * @param limit the maximum number of recommendations to return
 * @returns the recommended apps for the given user
 * 
 * example query:
MATCH (:Reviewer {steamId: "76561198154485185"})-[review:REVIEWED]->(app)
MATCH (app)<-[review2:REVIEWED]-(reviewer2:Reviewer)
WHERE review.recommended = review2.recommended
MATCH (reviewer2)-[:REVIEWED {recommended: true}]->(app2:App)
RETURN DISTINCT app2.appName
LIMIT 5
 */
export const getRecommendedApps = async (steamId: string, limit: number) => {
  limit = isNaN(limit) ? 5 : limit;
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:Reviewer {steamId: $steamId})-[review:REVIEWED]->(app)
       MATCH (app)<-[review2:REVIEWED]-(reviewer2:Reviewer)
       WHERE review.recommended = review2.recommended
       MATCH (reviewer2)-[:REVIEWED {recommended: true}]->(app2:App)
       RETURN DISTINCT app2.appName
       LIMIT $limit`,
      {
        steamId,
        limit: neo4j.int(limit),
      }
    );
  } finally {
    await session.close();
  }

  return result 
  ? result.records.map(record => record.get('app2.appName'))
  : [];
};

/**
 * Given an app id, find the most similar apps based on the reviews of users who have reviewed both apps
 * @param appName the app name of the app to find similar apps for
 * @param limit the maximum number of similar apps to return
 * @returns the similar apps for the given app
 * 
 * example query:
MATCH (:App {appName: "Stardew Valley"})<-[review:REVIEWED]-(reviewer:Reviewer)
MATCH (reviewer)-[review2:REVIEWED]->(app2:App)
WHERE review.recommended = review2.recommended
AND app2.appName <> "Stardew Valley"
RETURN DISTINCT app2.appName
LIMIT 5
 */
export const getSimilarApps = async (appName: string, limit: number) => {
  limit = isNaN(limit) ? 5 : limit;
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:App {appName: $appName})<-[review:REVIEWED]-(reviewer:Reviewer)
       MATCH (reviewer)-[review2:REVIEWED]->(app2:App)
       WHERE review.recommended = review2.recommended
       AND app2.appName <> $appName
       RETURN DISTINCT app2.appName
       LIMIT $limit`,
      {
        appName,
        limit: neo4j.int(limit),
      }
    );
  } finally {
    await session.close();
  }

  return result 
  ? result.records.map(record => record.get('app2.appName'))
  : [];
}

/*
==============================
  FULL CRUD FOR REVIEW ENTITY
==============================
*/

/**
 * Create a review relationship, then use a transaction to create the app and reviewer nodes if they don't exist
 * @param review the review to create
 * @returns the review created
 * 
 * example query:
MERGE (:App {appId: "413150"})  
MERGE (:Reviewer {steamId: "76561198154485185"})

MATCH (app:App {appId: "413150"}), (reviewer:Reviewer {steamId: "76561198154485185"})
MERGE (reviewer)-[review:REVIEWED {reviewId: 666}]->(app)
SET review.reviewText = "i like dis game", review.recommended = true, review.timeCreated = 0
 */
export const createReview = async (review: {
  appId: string;
  steamId: string;
  reviewId: string;
  reviewText: string;
  recommended: boolean;
  timeCreated: number;
}) => {
  const session = db.session();

  try {
    // first create the app and reviewer nodes if they don't exist
    await session.run(
      `MERGE (:App {appId: $appId})  
       MERGE (:Reviewer {steamId: $steamId})`,
      { appId: review.appId, steamId: review.steamId }
    );
    // then create the review relationship
    await session.run(
      `MATCH (app:App {appId: $appId}), (reviewer:Reviewer {steamId: $steamId})
       MERGE (reviewer)-[review:REVIEWED {reviewId: $reviewId}]->(app)
       SET review.reviewText = $reviewText, review.recommended = $recommended, review.timeCreated = $timeCreated`,
      { ...review, timeCreated: neo4j.int(review.timeCreated) }
    );
  } finally {
    await session.close();
  }

  return review;
};

/**
 * Searches for reviews of a given app by the review text
 * @param appId the app id of the app to search reviews for
 * @param searchTerm the term to search for in the review text
 * @param limit the maximum number of reviews to return
 * @returns the reviews for the given app that contain the given search term
 * 
 * example query:
MATCH (:App {appId: "413150"})<-[review:REVIEWED]-(:Reviewer)
WHERE review.reviewText CONTAINS "dis game"
RETURN review.reviewText
ORDER BY review.timeCreated
LIMIT 5
 */
export const searchReviewsByReviewText = async (
  appId: string,
  searchTerm: string,
  limit: number
) => {
  limit = isNaN(limit) ? 5 : limit;
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:App {appId: $appId})<-[review:REVIEWED]-(:Reviewer)
       WHERE review.reviewText CONTAINS $searchTerm
       RETURN review.reviewText, review.reviewId
       ORDER BY review.timeCreated
       LIMIT $limit`,
      { appId, searchTerm, limit: neo4j.int(limit) }
    );
  } finally {
    await session.close();
  }

  return result 
  ? result.records.map(record => `Review ID: ${record.get('review.reviewId')}: ${record.get('review.reviewText')}`)
  : [];
};

/**
 * Get a review by its reviewId
 * @param reviewId the reviewId of the review to get
 * @returns the review with the given reviewId
 * 
 * example query:
MATCH (:Reviewer)-[review:REVIEWED {reviewId: 666}]->(:App)
RETURN review.reviewText, review.recommended
 */
export const getReviewById = async (reviewId: string) => {
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:Reviewer)-[review:REVIEWED {reviewId: $reviewId}]->(:App)
       RETURN review.reviewText, review.recommended`,
      { reviewId }
    );
  } finally {
    await session.close();
  }

  return result?.records[0]
  ? `${result.records[0].get('review.recommended') ? '' : 'Not '}Recommended: ${result.records[0].get('review.reviewText')}`
  : `No review found with review id ${reviewId}`;
};

/**
 * Updates the review text of a review
 * @param reviewId the ID of the review to update
 * @param reviewText the new review text
 * @returns the updated review
 * 
 * example query:
MATCH (:Reviewer)-[review:REVIEWED {reviewId: 666}]->(:App)
SET review.reviewText = "nvm i changed my mind", review.timeUpdated = 1, review.recommended = false
RETURN review.reviewText, review.recommended
 */
export const updateReview = async (
  reviewId: string,
  recommended: boolean,
  reviewText: string
) => {
  const session = db.session();
  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:Reviewer)-[review:REVIEWED {reviewId: $reviewId}]->(:App)
       SET review.reviewText = $reviewText, review.timeUpdated = $timeUpdated, review.recommended = $recommended
       RETURN review.reviewText, review.recommended`,
      { reviewId, reviewText, recommended, timeUpdated: neo4j.int(Date.now()) }
    );
  } finally {
    await session.close();
  }

  return result?.records[0]
  ? `${result.records[0].get('review.recommended') ? '' : 'Not '}Recommended: ${result.records[0].get('review.reviewText')}`
  : `No review found with review id ${reviewId}`;
};

/**
 * Deletes a review by its reviewId
 * @param reviewId the reviewId of the review to delete
 * @returns the review that was deleted
 * 
 * example query:
MATCH (:Reviewer)-[review:REVIEWED {reviewId: 666}]->(app:App)
WITH review, review.reviewId AS id, app.appName AS appName
DELETE review
RETURN id, appName
 */
export const deleteReview = async (reviewId: string) => {
  const session = db.session();

  let result: QueryResult<Dict<PropertyKey, any>> | undefined;
  try {
    result = await session.run(
      `MATCH (:Reviewer)-[review:REVIEWED {reviewId: $reviewId}]->(app:App)
       WITH review, review.reviewId AS id, app.appName AS appName
       DELETE review
       RETURN id, appName`,
      { reviewId }
    );
  } finally {
    await session.close();
  }
  
  return result?.records[0]
  ? `Deleted review ${result.records[0].get('id')} for app ${result.records[0].get('appName')}`
  : `No review found with review id ${reviewId}`;
};
