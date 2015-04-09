# STYX
Keyword processing for the Twitter Streaming API.

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
