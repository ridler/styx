var fs = require('fs');

var data = JSON.parse(fs.readFileSync('talliedCounties.json'));

var csv = 'numbers'+'\n'; var count = 1;
data.features.forEach(function(feature) {
  process.stdout.write('processing feature: '+count+' of '+data.features.length+'\r');
  csv+=feature.properties.ratio+'\n';
  count++;
});

fs.writeFileSync('freq.csv', csv);
