var turf = require('turf');
var fs = require('fs');
var db = require('../db');
var init = require('../init');

var counties = JSON.parse(fs.readFileSync('fusedCounties.json'));

counties.features.forEach(function(box) {
  box.properties['tweetCount'] = 0;
});

var stream = db.Coords.find().stream();

var num = 0;
stream.on('data', function(data) {

  process.stdout.write('processing coordinate: '+(num++)+'\r');

  var c = [];
  data.coordinates.split(',').forEach(function(num) {
    c.push(parseFloat(num));
  });

  var point = {
    "type": "Feature",
    "properties": {
      "word": data.word
  },
    "geometry": {
      "type": "Point",
      "coordinates": c
    }
  };

  counties.features.forEach(function(box) {
    if(turf.inside(point, box)) {
      box.properties['tweetCount']++;
    };
  });

});

stream.on('close', function() {
  console.log('DB Stream Closed.  Calculating Ratios...');
  counties.features.forEach(function(box) {
    box.properties['ratio'] = 100000*(box.properties.tweetCount/box.properties.population);
  });
  var max = 0;
  counties.features.forEach(function(box) {
    if(box.properties.ratio > max) {
      max = box.properties.ratio;
    }
  });
  console.log('Maximum Ratio: '+max);
  fs.writeFileSync('../public/talliedCounties.json', JSON.stringify(counties));
  fs.writeFileSync('talliedCounties.json', JSON.stringify(counties));
  process.exit(0);
});

stream.on('error', function(err) {
  console.log('ERROR: '+err);
  process.exit(1);
});
