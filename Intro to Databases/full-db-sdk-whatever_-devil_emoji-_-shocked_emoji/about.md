# Introduction

Authors: Whatever 😈😳
-Aidan Srouji
-Natalie Lau
-Garrett Marzo

The [Steam Game Reviews](https://www.kaggle.com/datasets/najzeko/steam-reviews-2021) dataset contains millions of user reviews of various games available on the Steam platform.

---

# Usage

This dataset can be used to get an idea of the general rating of a game available for purchase on Steam before buying it.

Applications can ask many things of this dataset, a few examples of such being:

- Recommended apps for a given user based on their previous reviews.
- Similar apps to a given app based on the reviews they have in common.
- Finding reviews for apps based on some search term.

---

# Data Model Rationale

We chose to represent the data as a graph because it enables us to represent the relationships between the different entities in the dataset. For example, we may be able to determine what games are similar to each other based on the reviews they have in common. We can also use this relationship to recommend games to users based on their previous reviews. While there are some downsides to using a graph database, such as slower key-value lookups, we believe that the benefits of using a graph database outweigh the downsides.

# Assessment

We feel that our choice of graph database was a good one. The relationships between entities in the dataset allowed us to find interesting insights about the data. For example, we were able to find the most similar games to a given game based on the reviews they have in common. We were also able to use some of the review properties to determine similarity between reviews left on a single game, which allowed us to recommend games to users based on their previous reviews and the outgoing relationships from those reviewers.