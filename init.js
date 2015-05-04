var fs = require('fs');
var path = require('path');

var resources = path.join(__dirname, 'conf', 'resources.json');
var keywords = path.join(__dirname, 'conf', 'keywords.json');

exports.conf = JSON.parse(fs.readFileSync(resources));

var categories = JSON.parse(fs.readFileSync(resources));

exports.color = function(word) {
  for(var category in categories) {
    if(categories[category].track.contains(word)) {
      return categories[category]['color'];
    }
  }
};

exports.stats = {
  calc: function(stats) {
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
  }
};

exports.categories = categories;
