import neo4j from 'neo4j-driver'

const dbUser = process.env.DB_USER || 'neo4j'
const db = new neo4j.driver(process.env.DB_URL, neo4j.auth.basic(dbUser, process.env.DB_PASSWORD))

const getReviewsByAppId = async (appId, limit = 100) => {
  const session = db.session()

  let result
  try {
    result = await session.run(
      `MATCH (app:App {appId: $appId})<-[review:REVIEWED]-(reviewer:Reviewer)
       RETURN reviewText, recommended
       ORDER BY review.timeCreated
       LIMIT $limit`,
      { appId, limit: neo4j.int(limit) }
    )
  } finally {
    await session.close()
  }

  return result ? result.records : []
}

const insertReview = async (
  appId,
  steamId,
  reviewId,
  reviewText,
  timeCreated,
  timeUpdated,
  recommended,
  playTime
) => {
  const session = db.session()

  let result;
  try {
    result = await session.run(
      `MATCH 
          (app:App {appId: $appId}),
          (reviewer:Reviewer {steamId: $steamId})
       CREATE (reviewer)-[review:REVIEWED {reviewId: $reviewId, reviewText: $reviewText, timeCreated: $timeCreated, timeUpdated: $timeUpdated, recommended: $recommended, playTime: $playTime}]->(app)
       RETURN review`,
      {
        appId,
        steamId,
        reviewId,
        reviewText,
        timeCreated: neo4j.int(timeCreated),
        timeUpdated: neo4j.int(timeUpdated),
        recommended: neo4j.toBoolean(recommended),
        playTime: neo4j.int(playTime)
      }
    )
  } finally {
    await session.close()
  }

  return result?.records?.[0].get('review')
}

export { getReviewsByAppId, insertReview }