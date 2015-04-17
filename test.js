var data = [
  {
    color: 'red',
    data: 1
  },
  {
    color: 'green',
    data: 2
  },
  {
    color: 'blue',
    data: 3
  },
  {
    color: 'green',
    data: 4
  }
];

var colors = ['red', 'green', 'blue'];


var colorSort = function(list, buckets, key) {
  var sorted = {};
  buckets.forEach(function(bucket) { sorted[bucket] = []; });
  list.forEach(function(part) {
    buckets.forEach(function(bucket) {
      if(part[key] == bucket) { sorted[bucket].push(part); }
    });
  });
  return sorted;
};

console.log(colorSort(data, colors, 'color'));
