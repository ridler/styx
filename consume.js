var fs = require('fs');
var mongoose = require('mongoose');
var Twitter = require('twitter');

var conf = JSON.parse(fs.readFileSync('resources.json'));
mongoose.connect(conf.mongo.connect);

var categories = JSON.parse(fs.readFileSync('keywords.json'));
var keywords = [];

for(var category in categories) {
  categories[category].forEach(function(word) { keywords.push(word); });
}
var usa = '-125.4,27.5,-58.9,50.3';

var Tweet = mongoose.model('Tweet', { tweet: String });

var client = new Twitter(JSON.parse(fs.readFileSync('auth.json')));

client.stream('statuses/filter', { track: keywords.toString(), location: usa }, function(stream) {
  var num = 0;
  stream.on('data', function(data) {
    var tweet = new Tweet({ tweet: JSON.stringify(data) });
    tweet.save(function(error) {
      if(error) { console.log(error); }
      else { num++; console.log('wrote tweet '+num); }
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });

});
