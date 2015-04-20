# STYX
STYX does keyword processing for the Twitter Streaming API.  It will categorize tweets in the USA based on categories and words that the user provides.  It uses MongoDB as a cache as well as to store all relevant generated data.  Tweets with geocoordinates will be saved for mapping purposes.  The last 500 tweets consumed with geocoordinates will be mapped in real time on the UI.

## Setup

### `keywords.json`
To run this system, you must supply a keywords file. Each word in the inner arrays will be tracked on twitter, and the outer categories will be used to summarize the data.  For example, if you were worndering what type of alcoholic beverages people tweeted about most often, you would do something like this in the `keywords.json' file.

``` json
{
  "wine": {
    "color": "red",
    "track": [
      "cabernet sauvignon",
      "merlot",
      "chardonnay"
    ]
  },
  "beer": {
    "color": "orange",
    "track": [
      "IPA",
      "trippel",
      "lager",
      "stout"
    ]
  },
  "cocktails": {
    "color": "yellow",
    "track": [
      "negroni",
      "margarita",
      "martini"
  ]
}
```
cabernet sauvignon, merlot, chardonnay, IPA, etc. would be tracked on twitter, then the processor file would put each tweet containing whatever word into its outer "category", and corresponding geo-tagged tweets would appear as points on the map in the specified "color" attribute.

## `auth.json`
You must provide your Twitter API credentials in the following format:
```json
{
  "consumer_key"        : "your key",
  "consumer_secret"     : "your secret",
  "access_token_key"    : "your token key",
  "access_token_secret" : "your token secret"
}
```

## `resources.json`
You must provide the connection URI of a MongoDB instance and an Express server in the following format:
```json
{
  "mongo": {
    "connect": "mongodb://<your connection info>"
  },
  "express": {
    "address": "0.0.0.0",
    "streamPort": 3000
  }
}
```
### Running the System
Run each of the following commands seperately and make sure they output something that isn't an error.
```bash
node consume.js
node process.js
node server.js
```
Data should start appearing on a webpage at `localhost:8080` after a few seconds.

## Files
- `server.js` provides web applications features through Express.js.  It serves content in `public/` and `views/`.
- `consume.js` establishes a connection to the Twitter API and writes tweets to mongo as soon as they are recieved.
- `process.js` reads tweets off of mongo and does initial processing on them.  It then writes generated data back to the same mongo instance.
