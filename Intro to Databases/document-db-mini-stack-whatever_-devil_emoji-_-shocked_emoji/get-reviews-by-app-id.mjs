#!/usr/bin/env node

import { getReviewsByAppId } from './steam-dal.mjs';

if (process.argv.length < 3 || process.argv.length > 4) {
  console.log('Usage: get-reviews-by-app-id <appId> <limit>');
  process.exit(1);
}

const appId = process.argv[2];
const limit = parseInt(process.argv[3]) || 5;

try {
  const result = await getReviewsByAppId(appId, limit);
  if (!result) {
    console.log(`There is no app with ID ${appId}.`);
    process.exit(0);
  }
  console.log(`First ${limit} Reviews for ${appId}:`);
  for (const review of result) {
    console.log(review);
  }
} catch (error) {
  console.error(
    `Something went wrong, please ensure that ${appId} is a valid app ID.`
  );
}
