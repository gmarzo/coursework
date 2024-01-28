import {
  getAppId,
  getRecommendedApps,
  getReviewsForApp,
  getSimilarApps,
  createReview,
  searchReviewsByReviewText,
  getReviewById,
  updateReview,
  deleteReview,
} from "./steam-dal";
import promptSync from 'prompt-sync';
const prompt = promptSync({sigint: true});

/**
 * Print the menu of commands
 */
const printMenu = () => {
  console.log(`
  Type "help" to see this list again.
  Use ctrl-c to exit the program.
  Commands:
    getAppId <appName>
    recommendApps <steamId> <optional: limit>
    similarApps <appName> <optional: limit>
    appReviews <appName> <optional: limit>
    createReview <appId> <steamId> <reviewId> <recommended> <reviewText>
    searchReviews <appId> <searchTerm> <optional: limit>
    getReview <reviewId>
    updateReview <reviewId> <recommended> <reviewText>
    deleteReview <reviewId>

  Tip: You can use "getAppId" to get the app id for an app name.
  `);
}

/**
 * Print a header with the given text
 * @param header the text to print in the header
 */
const printHeader = (header: string) => {
  console.log();
  console.log('*'.repeat(process.stdout.columns));
  console.log(centerText(header));
  console.log('*'.repeat(process.stdout.columns));
}

/**
 * Center the given text in the console
 * @param text the text to center
 */
const centerText = (text: string) => {
  const padding = ' '.repeat((process.stdout.columns - text.length - 2) / 2);
  return `*${padding}${text}`.padEnd(process.stdout.columns - 1, ' ') + '*';
}

/**
 * Print the app id for the given app name
 * @param args an array where the first element is the app name
 */
const printAppId = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: getAppId <appName>');
    return;
  }

  const appName = args.join(' ');
  printHeader('App Id');
  const appId = await getAppId(appName);
  console.log(centerText(`${appName}: ${appId}`));
}

/**
 * Print the recommended apps for the given steam id
 * @param args an array where:
 *             first element is the steam id 
 *             second (optional) element is the limit of apps to print
 */
const printRecommendedApps = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: recommendApps <steamId> <optional: limit>');
    return;
  }

  const app = await getRecommendedApps(args[0], +args[1]);
  printHeader('App Recommendations');
  app.length > 0 ? app.map(app => console.log(centerText(app))) : console.log(`No recommendations found for steam id ${args[0]}.`)
};

/**
 * Print a list of similar apps for the given app name
 * @param args an array where:
 *             first element(s) make up the app name (may span multiple elements if the app name has spaces)
 *             last (optional) element is the limit of apps to print
 */
const printSimilarApps = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: similarApps <appName> <optional: limit>');
    return;
  }

  const appName = args.reduce((name, arg) => Number.isNaN(+arg) ? `${name} ${arg}` : name);
  const apps = await getSimilarApps(appName, +args[args.length - 1]);
  printHeader('Similar Apps');
  apps.length > 0 ? apps.map(app => console.log(centerText(app))) : console.log(`No similar apps found for ${appName}.`)
}

/**
 * Print the reviews for the given app name
 * @param args an array where:
 *             first element(s) make up the app name (may span multiple elements if the app name has spaces)
 *             last (optional) element is the limit of reviews to print
 */
const printAppReviews = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: appReviews <appName> <optional: limit>');
    return;
  }

  const appName = args.reduce((name, arg) => Number.isNaN(+arg) ? `${name} ${arg}` : name);

  const reviews = await getReviewsForApp(appName, +args[args.length - 1]);
  printHeader('App Reviews');
  reviews.length > 0 ? reviews.map(review => console.log(`\t${review}\n`)) : console.log(`Please check that ${appName} is a valid app name.`)
}

/**
 * Create a review and print the review created
 * @param args an array where:
 *             first element is the app id
 *             second element is the steam id
 *             third element is the review id
 *             fourth element is whether the user recommends the app (true or false)
 *             fifth element onwards is the review text (may span multiple elements if the review text has spaces)
 */
const printCreateReview = async (...args: string[]) => {
  if (!args[0] || !args[1] || !args[2] || (args[3] !== 'true' && args[4] !== 'false') || !args[4]) {
    console.log('Usage: createReview <appId> <steamId> <reviewId> <recommended> <reviewText>');
    console.log('tip: recommended should be "true" or "false"')
    return;
  }

  const confirm = await createReview({
    appId: args[0],
    steamId: args[1],
    reviewId: args[2],
    reviewText: args.slice(4).join(' '),
    recommended: args[3] === 'true',
    timeCreated: Date.now(),
  });

  printHeader('Create Review');
  console.log(confirm);
}

/**
 * Print reviews of a given app that contain the given search term
 * @param args an array where:
 *             first element is the app id
 *             second element is the search term (may span multiple elements if the search term has spaces)
 *             last (optional) element is the limit of reviews to print
 */
const printSearchReviews = async (...args: string[]) => {
  if (!args[0] || !args[1]) {
    console.log('Usage: searchReviews <appId> <searchTerm> <optional: limit>');
    return;
  }

  const searchTerm = args.slice(1).reduce((name, arg) => Number.isNaN(+arg) ? `${name} ${arg}` : name);
  const reviews = await searchReviewsByReviewText(args[0], searchTerm, +args[args.length - 1]);
  printHeader('Search Reviews');
  reviews.length > 0 ? reviews.map(review => console.log(`\t${review}\n`)) : console.log(`No reviews containing "${searchTerm}" found for app id ${args[0]}.`)
}

/**
 * Print the review with the given review id
 * @param args an array where the first element is the review id
 */
const printGetReview = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: getReview <reviewId>');
    return;
  }

  const review = await getReviewById(args[0]);
  printHeader(`Review ${args[0]}`);
  console.log(review);
}

/**
 * Update the review with the given review id and print the updated review
 * @param args an array where:
 *             first element is the review id
 *             second element is whether the user recommends the app (true or false)
 *             third element onwards is the review text (may span multiple elements if the review text has spaces)
 */
const printUpdateReview = async (...args: string[]) => {
  if (!args[0] || (args[1] !== 'true' && args[1] !== 'false') || !args[2]) {
    console.log('Usage: updateReview <reviewId> <recommended> <reviewText>');
    console.log('tip: recommended should be "true" or "false"')
    return;
  }

  const review = await updateReview(args[0], args[1] === 'true', args.slice(2).join(' '));
  printHeader(`Update Review ${args[0]}`);
  console.log(review);
}

/**
 * Delete the review with the given review id and print confirmation
 * @param args an array where the first element is the review id
 */
const printDeleteReview = async (...args: string[]) => {
  if (!args[0]) {
    console.log('Usage: deleteReview <reviewId>');
    return;
  }

  const review = await deleteReview(args[0]);
  printHeader(`Delete Review ${args[0]}`);
  console.log(review);
}

printHeader('Welcome to the Steam Review CLI');
console.log('Enter a command to get started.');
console.log('Type "help" to see a list of commands.\n');
const commands = { help: printMenu, getAppId: printAppId, similarApps: printSimilarApps, recommendApps: printRecommendedApps, appReviews: printAppReviews, createReview: printCreateReview, searchReviews: printSearchReviews, getReview: printGetReview, updateReview: printUpdateReview, deleteReview: printDeleteReview }

/**
 * Main function that runs the CLI
 */
const main = async () => {
  let input = prompt('steam-review-cli> ');
  while (true) {
    const args = input.split(' ');

    const command = commands[args[0] as keyof typeof commands];
    command ? await command(...args.slice(1)) : console.log('Invalid command. Type "help" to see a list of commands.')

    input = prompt('steam-review-cli> ');
  }
}

main();