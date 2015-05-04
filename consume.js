var fs = require('fs');
var Twitter = require('twitter');
var db = require('./db');
var init = require('./init');

var keywords = [];

for(var category in init.categories) {
  init.categories[category].track.forEach(function(word) { keywords.push(word); });
};

var usa = '-125.4,27.5,-58.9,50.3';

var client = new Twitter(JSON.parse(fs.readFileSync('./conf/auth.json')));

var num = 0;

client.stream('statuses/filter', { track: keywords.toString(), location: usa }, function(stream) {
  stream.on('data', function(data) {
    var tweet = new db.Tweet({ tweet: JSON.stringify(data) });
    tweet.save(function(error) {
      if(error) { console.log(error); }
      else { num++; }
    });
  });

  stream.on('error', function(error) {
    console.log(error);
  });

});

setInterval(function() {
  console.log('tweets: '+num+'\t'+'time: '+new Date());
}, 2*60000);
