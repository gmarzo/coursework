dataset link [here](https://www.kaggle.com/datasets/najzeko/steam-reviews-2021)

---

database name: `steam_reviews`, contains collections `reviews` and `apps`

`reviews` JSON structure:

```json
{
  "review_id": "number",
  "app_id": "number",
  "review_text": "string",
  "recommended": "boolean",
  "upvotes": "number",
  "language": "string",
  "time": {
    "time_created": "number",
    "time_updated": "number"
  }
}
```

`apps` JSON structure:

```json
{
  "app_id": "number",
  "app_name": "string"
}
```
