var fs = require('fs');

exports.conf = JSON.parse(fs.readFileSync('resources.json'));

var categories = JSON.parse(fs.readFileSync('keywords.json'));

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
