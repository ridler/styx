var net = require('net');
var db = require('./db');
var init = require('./init');

var socket = net.Socket()

var connect = function() {
  try { socket.connect(init.conf.express.streamPort, init.conf.express.address); }
  catch(e) { console.log(e); }
}; connect();

socket.on('error', function() { connect(); });

var stats = {};
db.Stats.find({}, function(error, stat) {
  if(stat[0] && stat[0].numbers != null) {
    stats = JSON.parse(stat[0].numbers);
    console.log('loaded stats');
  } else {
    for(var category in init.categories) {
      init.categories[category].track.forEach(function(word) {
        stats[word] = 0;
      });
    }
  }
});

var inBounds = function(coords) {
  var sw = [-130, 24];
  var ne = [-62, 50];
  if(coords[0] > sw[0] && coords[0] < ne[0] &&
     coords[1] > sw[1] && coords[1] < ne[1]) {
      return true;
  }
  return false;
}

var num = 0;

var processTweets = function() {

  var stream = db.Tweet.find().stream();
  stream.on('data', function(data) {
    num++;
    try {
      var tweet = JSON.parse(data.tweet);

      if(tweet.coordinates && inBounds(tweet.coordinates.coordinates)) {
        var keeper = new db.Located({
          text: tweet.text,
          user: tweet.user.screen_name,
          coordinates: tweet.coordinates.coordinates.toString(),
          tweet_id: tweet.id_str
        });
        keeper.save(function(error) {});
        socket.write(JSON.stringify({located: keeper}));

        var locatedWord = '';
        for(var word in stats) {
          if(tweet.text.indexOf(word) >= 0) {
            locatedWord = word;
            condensed = new db.Coords({
              coordinates: tweet.coordinates.coordinates.toString(),
              word: locatedWord
            });
            condensed.save(function(error) {});
          }
        }
      }

      for(var word in stats) {
        if(tweet.text.indexOf(word) >= 0) { stats[word]++; }
      }

    } catch(e) { console.log(e); }
  });

  stream.on('error', function(error) {
    console.log('DB READ ERROR');
    setTimeout(processTweet, 1000);
  });

  stream.on('close', function() {
    db.Tweet.remove({}, function() {});
    if(stats != null) { db.Stats.remove({}, function() {}); }
    var write = new db.Stats({ numbers: JSON.stringify(stats) });
    write.save(function(error) {});
    socket.write(JSON.stringify({stats: stats}));
    setTimeout(processTweets, 5000);
  });
}

var clean = function() {
  console.log('processed: '+num+'\t time: '+new Date());
  db.Located.find({}).sort('timestamp').exec(function(error, tweets) {
    if(tweets.length > 600) {
      var gone = tweets.slice(500, tweets.length);
      gone.forEach(function(e) {
        db.Located.remove({ _id: e._id }, function() {});
      });
    }
  });
  db.Coords.count({}, function(error, count) {
    if(count > 100000) {
      db.Coords.find({}).sort('timestamp').exec(function(error, coords) {
        var gone = coords.slice(990000, coords.length);
        gone.forEach(function(e) {
          db.Coords.remove({ _id: e._id }, function() {});
        });
      });
    }
  });
}

processTweets();

clean(); setInterval(clean, 2*60000);
