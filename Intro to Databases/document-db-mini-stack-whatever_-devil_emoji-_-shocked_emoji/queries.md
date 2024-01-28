# Database Queries

## 1. Get the review text of 5 reviews for Overcooked! 2 (app_id=728880)

Query:

```js
db.reviews.find({ app_id: '728880' }, { _id: 0, review_text: 1 }).limit(5);
```

Output:

```json
[
  {
    "review_text": "Cute and fantastic fun with friends on any platform! I have this for PS4 and PC. If there were any concerns it would be the online play for PC especially can put a damper on the fun when the player connecting to the host is having lag. This is not necessarily the fault of the game, more so it is the internet resources that are to blame. Perhaps there is another way we could go about connecting?"
  },
  { "review_text": "Very nice!" },
  { "review_text": "love this game love playing with it friends" },
  {
    "review_text": "love this game its so fun to play with friends online!"
  },
  {
    "review_text": "The game has some bugs but it''s fun to play with somebody. Worth buying on sale"
  }
]
```

## 2. Get the top 5 most upvoted reviews across all steam games that recommend the game

Query:

```js
db.reviews
  .find({ recommended: true }, { _id: 0, review_text: 1, upvotes: 1 })
  .sort({ upvotes: -1 })
  .limit(5);
```

Output:

```json
[
  {
    "review_text": "Since playing this I have a legit fear that there won''t be any game like this anymore.",
    "upvotes": "998"
  },
  { "review_text": "More realistic than fifa", "upvotes": "997" },
  {
    "review_text": "I CANNOT RUN THIS GAME ON MY 20 YEAR OLD TOASTER THEREFORE IT IS A BAD GAME AND I MUST WRITE A NEGATIVE STEAM REVIEW ABOUT IT.\\\\n\\\\n\\\\nTHAT''LL SHOW ''EM.",
    "upvotes": "997"
  },
  { "review_text": "Every steam library needs Terraria", "upvotes": "997" },
  {
    "review_text": "get out of my head\\\\nget out of my head\\\\nget out of my head\\\\nget out of my head\\\\nget out of my head\\\\nget out of my head\\\\nget out of my head\\\\nget out of my head\\\\nGET OUT OF MY HEAD",
    "upvotes": "996"
  }
]
```

## 3. Determine which game with at least 100 reviews has the highest recommended ratio

Query 1: Get the app_id of the game with the highest recommended ratio

```js
db.reviews.aggregate([
  {
    $group: {
      _id: '$app_id',
      recommendedRatio: { $avg: { $cond: ['$recommended', 1, 0] } },
      reviewCount: { $sum: 1 },
    },
  },
  { $match: { reviewCount: { $gte: 100 } } },
  { $sort: { recommendedRatio: -1 } },
  { $limit: 1 },
]);
```

Query 1 Output:

```json
[
  {
    "_id": "1229490",
    "recommendedRatio": 0.9958071278825996,
    "reviewCount": 4770
  }
]
```

Query 2: Get the name of the game using the returned app_id

```js
db.apps.find({ app_id: '1229490' }, { _id: 0, app_name: 1 });
```

Query 2 Output:

```json
[{ "app_name": "ULTRAKILL" }]
```

## 4. Get the name and review count of the 5 most reviewed games

Query:

```js
db.reviews.aggregate([
  { $group: { _id: '$app_id', numReviews: { $sum: 1 } } },
  { $sort: { numReviews: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: 'apps',
      localField: '_id',
      foreignField: 'app_id',
      as: 'app',
    },
  },
  {
    $project: {
      _id: 0,
      name: { $arrayElemAt: ['$app.app_name', 0] },
      numReviews: '$numReviews',
    },
  },
]);
```

Output:

```json
[
  { "name": "Tom Clancy's Rainbow Six Siege", "numReviews": 371154 },
  { "name": "Terraria", "numReviews": 370240 },
  { "name": "Garry's Mod", "numReviews": 331621 },
  { "name": "Grand Theft Auto V", "numReviews": 319751 },
  { "name": "PLAYERUNKNOWN'S BATTLEGROUNDS", "numReviews": 317846 }
]
```

## 5. Get the review text and upvotes of the top ten reviews for Overcooked! 2 (app_id=728880), sorted by number of upvotes (descending).

Query:

```js
db.reviews.aggregate([
  { $match: { app_id: '728880' } },
  { $sort: { upvotes: -1 } },
  { $limit: 10 },
  { $project: { _id: 0, review_text: 1, upvotes: 1 } },
]);
```

Output:

```json
[
  {
    "review_text": "As a returning player: 6/10, for those new to the series: 9/10. Review will be from the first perspective.\\\\n\\\\nBeing quite familiar with the first game, my partner and I were super excited for more cooking chaos but ultimately we didn''t feel the game is worth the money. The first three/four worlds we 3-starred everything on our first try just from familiarity with the game, the throwing mechanic has a lot of potential and the Kevin levels were a lot of fun but in the end it feels like we only got about 12 levels of actual difficulty.\\\\n\\\\nOvercooked 2 was the time to add in a level editor, not switches on the world map (what are those even for, anyway?). Make the game replayable, maybe a new game+ that you can select at the start if you''re familiar with OC already/unlocked at the end of story that changes up the base game. OC2 isn''t a sequel, it''s just the definitive version of OC1.",
    "upvotes": "99"
  },
  {
    "review_text": "---{Gameplay}---\\\\n☑️ Try not to get addicted\\\\n☐ Very good\\\\n☐ Good\\\\n☐ Nothing special\\\\n☐ Ehh\\\\n☐ Bad\\\\n☐ Just dont\\\\n\\\\n---{Graphics}---\\\\n☐ You forget reality \\\\n☐ Masterpiece\\\\n☐ Beautiful\\\\n☐ Good\\\\n☑️ Decent\\\\n☐ Will do\\\\n☐ Bad\\\\n☐ Awful\\\\n☐ Paint.exe\\\\n\\\\n---{Audio}---\\\\n☐ Eargasm\\\\n☐ Very good\\\\n☑️ Good\\\\n☐ Decent\\\\n☐ Not too bad\\\\n☐ Bad\\\\n☐ Earrape\\\\n\\\\n---{Audience}---\\\\n☐ Kids\\\\n☐ Teens\\\\n☐ Adults\\\\n☑️ Everyone\\\\n\\\\n---{PC Requirements}---\\\\n☐ Check if you can run paint\\\\n☐ Potato\\\\n☑️ Decent\\\\n☐ Fast\\\\n☐ Rich boi\\\\n☐ Ask NASA if they have a spare computer\\\\n\\\\n---{Story}---\\\\n☐ Nothing Special\\\\n☑️ Not greatly told\\\\n☐ Average\\\\n☐ Good\\\\n☐ Lovely\\\\n☐ Will make you cry or smile a lot\\\\n\\\\n---{Difficulity}---\\\\n☐ Just press a bunch of buttons\\\\n☐ Easy\\\\n☑️ Significant brain usage\\\\n☐ Easy to learn / Hard to master\\\\n☐ Not so easy\\\\n☐ Difficult\\\\n☐ Dark Souls\\\\n\\\\n---{Grind}---\\\\n☐ Nothing\\\\n☐ Only if you care about leaderboards/ranks\\\\n☐ Isnt necessary to progress\\\\n☐ A bit grindy sometimes\\\\n☐ Average grind level\\\\n☑️ A bit grindy\\\\n☐ Insanity\\\\n\\\\n---{Game Time}---\\\\n☐ Long enough for a cup of tea\\\\n☐ Short\\\\n☑️ Average\\\\n☐ Long\\\\n☐ Depends on you\\\\n☐ Endless\\\\n\\\\n---{Price}---\\\\n☐ Just buy it\\\\n☑️ Worth the price\\\\n☐ Wait for sale\\\\n☐ Maybe if you have some spare money left\\\\n☐ Not recommended\\\\n☐ Dont throw money into a rubbish bin\\\\n\\\\n---{Bugs}---\\\\n☑️ Never had any\\\\n☐ Minor bugs\\\\n☐ Few bugs\\\\n☐ Can get annoying\\\\n☐ Ruining the game\\\\n☐ The game itself is a big terrarium for bugs",
    "upvotes": "95"
  },
  {
    "review_text": "If you like to cook, then dont play this. You''ll despise cooking and become solely depended on your food being delivered or pre-made due to unknown amounts of stress as your friends throw a supermarket worth of food at you telling to chop, cook, and serve it in 6 and a half seconds.",
    "upvotes": "9"
  },
  {
    "review_text": "4/10 - More like Undercooked! A deceptively marketed, gimmicky, overly short step backwards. Stick to the original outside of a deep special. \\\\n\\\\n= Intro = \\\\n\\\\nA big fan of the original, the wife and I have dozens of hours into it. Was extremely excited for the second one to the extent that we preordered it.\\\\n\\\\n= Gameplay =\\\\n\\\\nMake sure you have a gamepad. This is *not* keyboard friendly.\\\\n\\\\nThe core mechanics are the same as the original. Lots of new gimmicks in each level compensated by a very low 3 star score required. This results in a game that is both more irritating and less challenging. I remember some levels in the original that took me and the wife upwards of a dozen tries and we still had a blast. \\\\n\\\\nThere were perhaps 3 levels that took us more than one or two tries, and we were glad to be done with them as these levels felt like we were working against each other. \\\\n\\\\nOne in particular had a purple shimmering background that physically hurt my eyes. \\\\n\\\\nA wildly inconsistant difficultly level. The game is mostly very easy compared to the original, aside from a few extremely annoying levels. The final boss was an extreme letdown - we 3 starred it on our first try.\\\\n\\\\nTone and theme constantly waffled. Rather than having ''worlds'' like the first game, you jump from theme to theme and back again on a per level basis at random. This makes the entire game feel samey, while the original had a unique theme and gimmick each world.\\\\n\\\\nThe multiphase levels seen in the previews are cool, but there were about 3 of them the entire game and I felt a bit cheated. The vast majority are just one area.\\\\n\\\\nAfter finishing it, we are battling to even remember the levels that gave us difficulty.\\\\n\\\\nThe hub is also bizarre, with no rhyme or reason - finding switches feels like needless busywork and padding on an already thin game. Constantly having to go back to the middle to progress the story became a chore. \\\\n\\\\nWe blazed our way to act 6, beat the multiphase ''boss'' level and were expecting a final epic act involving the zombies to unlock. The game then just...ended.\\\\n\\\\n= Graphics and Audio = \\\\n\\\\nGraphics are pleasant and bright and the variety of chefs is cool. Audio is solid with a few catchy themes. Nothing wrong here.\\\\n\\\\n= Story = \\\\n\\\\nMeh. Compared to the charm of the original, we now have a disjointed, random trip through a bunch of unconnected levels with an overarching but NEVER SEEN ''zombie'' theme and then a ''final boss'' where we don''t even see the zombies! \\\\n\\\\n= Value = \\\\n\\\\nPoor. There is far less content and enjoyement here than the original game for about triple the price. This feels like a studio mandated product rather than the lovingly crafted masterpiece of the original.\\\\n\\\\n= Overall =\\\\n+ Core gameplay is still fun\\\\n+ Multiphase levels are cool\\\\n+ Cute chef designs\\\\n\\\\n- Overly short\\\\n- Gimmicky\\\\n- Overpriced\\\\n- Multiphase levels are rare\\\\n- No consistency between levels and themes\\\\n- Overly easy aside from a few irritatingly hard levels\\\\n- Lame climax\\\\n\\\\n= Final verdict: This is a sad and disappointing followup to the amazing original game. It feels like something the developers didn''t want to make. Wait for a deep special if you are interested, or better yet - just go through the original again.",
    "upvotes": "9"
  },
  {
    "review_text": "awesome game, even better with friends.",
    "upvotes": "9"
  },
  {
    "review_text": "i expected this to be a bad game, guess i was wrong.\\\\nThis has been a fantastic game so far! (Still doing some DLC maps and 4th stars too) playin'' with friends are nice too, sad that  i never can managed to get 4 people since I play with one person mostly, anyway, wonderful game.",
    "upvotes": "9"
  },
  {
    "review_text": "Reday for overcooked 3. I''m looking for \\\\n\\\\nZen mode \\\\n|--> untimed play,\\\\n|--> dynamic diffuclty that responds to player''s delivery rate\\\\n||--> morph from one level to the next through transition scenes\\\\n||--> dynamic time-to-deliver (order urgency)\\\\n\\\\ncharacter bios and traits\\\\n||--> racoon moves faster because his chair is motorized\\\\n||--> character has aim assist to never miss counter and pick up things easier\\\\n||--> chop faster\\\\n||--> shorter recovery time when falling into water or lava or in a cave etc\\\\n\\\\nMore ideas to come. Loved both games. This one exceeded my expectations. Found a balance between strategy and skill that makes it easy to swap in new users at a party. Story is hilarious. Better performance and stability. I haven''t gotten intothe online. I much prefer couch where the option is available and I reall appreciate this game as an edifice in the couch-gaming multiplayer culture\\\\n",
    "upvotes": "9"
  },
  {
    "review_text": "I hate to left the negative review for this game. Don''t get me wrong, it''s still a great game to have fun with your friends. The chaotic aspect of the game is largely improved with new mechanic and features.\\\\n\\\\nBut for those who have played overcooked! the amount of excitement just isn''t there. In my opinion the level design for overcooked 2 is TOO EASY for experienced players. Me and My friend only had around 10 retry to have all normal level 3 stars. With 10 hours in, the only achievement locked is the dish washing one. Yet I have''t finish the story of Overcooked1 with 25 hours on the record. You just don''t have the constant \"go back for more stars to unlock new level\" going on there.\\\\n\\\\nMaybe the game decided to work more towards the competing part, focused on the arcade and versus mode. But for me a causual game like this shouldn''t give me the pressure of a PVP game. It''s easier to have fun in PVE and less likely to get your temper in.\\\\n\\\\nWish there would be more content for this game (DLC maybe?)\\\\n\\\\n",
    "upvotes": "9"
  },
  {
    "review_text": "Fantastic game! The devs listened to the demands for the first game and gave this one online co-op! Still love it for being a fun couch game to play with friends though, it makes the whole experience a lot more interesting!",
    "upvotes": "9"
  },
  { "review_text": "super funsies!!", "upvotes": "9" }
]
```
