# STYX
STYX does keyword processing for the Twitter Streaming API.  It will categorize tweets in the USA based on categories and words that the user provides.  It uses MongoDB as a cache as well as to store all relevant generated data.  Tweets with geocoordinates will be saved for mapping purposes.  The last 300 tweets consumed with geocoordinates will be mapped in real time on the UI.

## Setup

### `keywords.json`
To run this system, you must supply a keywords file. Each word in the inner arrays will be tracked on twitter, and the outer categories will be used to summarize the data.  For example, if you were worndering what type of alcoholic beverages people tweeted about most often, you would do something like this in the `keywords.json' file.

``` json
{
  "wine": [
    "cabernet sauvignon",
    "merlot",
    "chardonnay"
  ],
  "beer": [
    "IPA",
    "trippel",
    "witbier",
    "stout"
  ],
  "cocktails": [
    "negroni",
    "margarita"
  ]
}
```
cabernet sauvignon, merlot, chardonnay, IPA, etc. would be tracked on twitter, then the processor file would put each tweet containing whatever word into its outer "category".

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
    "port": 3000
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

# TO DO
- Implement direct streaming of data between `process.js` and `server.js`.
- Implement richer processing of the data.
- Map the geolocated data.
- Develop a real UI.
