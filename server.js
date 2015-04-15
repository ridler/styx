var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var fs = require('fs');
var net = require('net');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

Array.prototype.contains = function(q) {
  var ans = false;
  this.forEach(function(e) { if(e == q) { ans = true; return; }});
  return ans;
}

var conf = JSON.parse(fs.readFileSync('resources.json'));
mongoose.connect(conf.mongo.connect);

var categories = JSON.parse(fs.readFileSync('keywords.json'));
var totals = {}; var percentages = {};
for(var category in categories) { totals[category] = 0; percentages[category] = 0 };

var Tweet = mongoose.model('Tweet', { tweet: String });
var Stats = mongoose.model('Stats', { numbers: String });
var Located = mongoose.model('Located', { data: String });
var Coords = mongoose.model('Coords', { coordinates: String, word: String });

var color = function(word) {
  for(var category in categories) {
    if(categories[category].track.contains(word)) {
      return categories[category]['color'];
    }
  }
};

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/coords', function(req, res) {
  Coords.find({}).limit(2900).exec(function(error, data) {
    if(error) { res.send(error); }
    else {
      var extract = [];
      data.forEach(function(e) {
        extract.push({
          coordinates: e.coordinates.split(',').reverse(),
          color: color(e.word)
        });
      });
      res.send(extract);
    }
  });
})

app.get('/3hun', function(req, res) {
  Located.find({}, function(error, data) {
    if(error) { res.send(error); }
    else {
      res.send(data);
    }
  });
});

app.get('/kwconf', function(req, res) {
  res.send(categories);
});

var calcStats = function(stats) {
  try {
    var totals = {}; var percentages = {};
    for(var category in categories) { totals[category] = 0; percentages[category] = 0 };
    var nums = stats;
    var keys = Object.keys(nums);
    var all = 0;
    keys.forEach(function(key) {
      for(var category in categories) {
        if(categories[category].track.contains(key)){
          totals[category] += nums[key];
          all += nums[key]
        }
      }
    });
    Object.keys(totals).forEach(function(category) {
      percentages[category] = totals[category]/all;
    });
    return ({totals: totals, percentages: percentages});
  } catch(e) { return e; }
};

app.get('/stats', function(req, res) {
  Stats.find({}, function(error, stats) {
    if(error) { res.send(error); }
    else {
      var result = calcStats(JSON.parse(stats[0].numbers));
      res.send(result);
    }
  });
});

var net = require('net');
var tcp = net.createServer(function(socket) {
    socket.on('data', function(data) {
      data = JSON.parse(data);
      console.log(data);
      if(data.stats) {
        io.emit('stats', calcStats(data.stats));
      } else if(data.located) {
        io.emit('located', data.located);
      }
    });
});
tcp.listen(conf.express.streamPort, conf.express.address);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


http.listen(8080, function() { console.log('listening on 8080'); });
