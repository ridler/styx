var mongoose = require('mongoose');
var init = require('./init');

mongoose.connect(init.conf.mongo.connect);

exports.Tweet = mongoose.model('Tweet', { tweet: String });

exports.Stats = mongoose.model('Stats', { numbers: String });

exports.Located = mongoose.model('Located', {
  timestamp: { type : Date, default: Date.now },
  text: String,
  user: String,
  coordinates: String,
  tweet_id: String
});

exports.Coords = mongoose.model('Coords', {
  coordinates: String,
  word: String,
  color: String,
  timestamp: { type : Date, default: Date.now }
});
