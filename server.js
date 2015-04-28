var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var fs = require('fs');
var net = require('net');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var init = require('./init');
var db = require('./db');

Array.prototype.contains = function(q) {
  var ans = false;
  this.forEach(function(e) { if(e == q) { ans = true; return; }});
  return ans;
};

app.get('/', function(req, res) {
  res.render('index');
});

app.get('/coords', function(req, res) {
  db.Coords.find({}).sort('timestamp').limit(5000).exec(function(error, data) {
    if(error) { res.send(error); }
    else {
      var extract = [];
      data.forEach(function(e) {
        extract.push({
          coordinates: e.coordinates.split(',').reverse(),
          color: init.color(e.word)
        });
      });
      res.send(extract);
    }
  });
})

app.get('/3hun', function(req, res) {
  db.Located.find({}, function(error, data) {
    if(error) { res.send(error); }
    else {
      res.send(data);
    }
  });
});

app.get('/kwconf', function(req, res) {
  res.send(init.categories);
});


app.get('/stats', function(req, res) {
  db.Stats.find({}, function(error, stats) {
    if(error) { res.send(error); }
    else {
      try {
        var result = init.stats.calc(JSON.parse(stats[0].numbers));
        res.send(result);
      } catch(e) { res.send(e); }
    }
  });
});

app.get('/counties', function(req, res) {
  res.render('counties');
});

var net = require('net');
var tcp = net.createServer(function(socket) {
    socket.on('data', function(data) {
      try {
        data = JSON.parse(data);
        if(data.stats) {
          io.emit('stats', init.stats.calc(data.stats));
        } else if(data.located) {
          io.emit('located', data.located);
        }
      } catch(e) {}
    });
});
tcp.listen(init.conf.express.streamPort, init.conf.express.address);

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
