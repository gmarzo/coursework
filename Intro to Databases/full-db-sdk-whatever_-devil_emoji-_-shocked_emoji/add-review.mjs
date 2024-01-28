#!/usr/bin/env node

import { insertReview } from './steam-dal.mjs';

if (process.argv.length < 7 || process.argv.length > 8) {
  console.log(
    'Usage: add-review <appId> <reviewText> <recommended> <upvotes> <timeCreated> <timeUpdated>'
  );
  process.exit(1);
}

const appId = process.argv[2];
const reviewText = process.argv[3];
const recommended = process.argv[4];
const upvotes = process.argv[5];
const timeCreated = process.argv[6];
const timeUpdated = process.argv[7];

try {
  const result = await insertReview(
    appId,
    reviewText,
    recommended,
    upvotes,
    timeCreated,
    timeUpdated
  );
  console.log(result);
  if (result.acknowledged) {
    console.log(`Review added for ${appId}`);
  } else {
    console.log(`There is no app with ID ${appId}.`);
  }
} catch (error) {
  console.error(
    `Something went wrong, please ensure that ${appId} is a valid app ID.`
  );
}
