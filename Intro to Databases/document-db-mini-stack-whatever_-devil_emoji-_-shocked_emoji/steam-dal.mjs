import mongodb from 'mongodb';
const { MongoClient } = mongodb;

const db = new MongoClient(`mongodb://127.0.0.1`, { useUnifiedTopology: true });

const DB_NAME = 'steam_reviews';
const REVIEWS_COLLECTION = 'reviews';

const reviewsCollection = () => db.db(DB_NAME).collection(REVIEWS_COLLECTION);

const arrayFromCursor = async (cursor) => {
  const result = [];
  await cursor.forEach((doc) => result.push(doc));
  return result;
};

const getReviewsByAppId = async (appId, limit = 100) => {
  try {
    await db.connect();
    const reviews = reviewsCollection();
    const cursor = await reviews
      .find(
        { app_id: appId },
        {
          projection: {
            _id: 0,
            app_id: 1,
            review_text: 1,
            reccomended: 1,
            upvotes: 1,
            time: 1,
          },
        }
      )
      .sort({ upvotes: -1 })
      .limit(limit);

    return await arrayFromCursor(cursor);
  } catch (e) {
    console.error(e);
  } finally {
    await db.close();
  }
};

const insertReview = async (
  appId,
  reviewText,
  recommended,
  upvotes,
  timeCreated,
  timeUpdated
) => {
  try {
    await db.connect();
    const reviews = reviewsCollection();

    return await reviews.insertOne({
      app_id: appId,
      review_text: reviewText,
      recommended: recommended,
      upvotes: upvotes,
      time: {
        time_created: timeCreated,
        time_updated: timeUpdated,
      },
    });
  } finally {
    await db.close();
  }
};

export { getReviewsByAppId, insertReview };
