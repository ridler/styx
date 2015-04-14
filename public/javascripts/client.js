(function () {

  var app = angular.module('hateUI', []);
  app.controller('graphics', ['$http', function($http) {
    var ui = this;
    ui.title = 'Categorical Statistics';
    ui.markers = false;
    ui.stats = {};
    ui.categories = [];
    ui.tweets = [];
    ui.coords = [];
    ui.keyColors = [];
    ui.cText = "Click on a circle to the right to see more information about it here."

    var map = L.map('heat-map').setView([38.50, -95.35], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var map2 = L.map('mark-map').setView([38.50, -95.35], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map2);

    map.scrollWheelZoom.disable();
    map2.scrollWheelZoom.disable();

    $http.get('/kwconf').success(function(data) {
      for(var key in data) {
        ui.keyColors.push(data[key].color);
      }
    });

    $http.get('/coords').success(function(data) {
      if(data != {}) {
        ui.coords = data;
        ui.coords.forEach(function(coord) {
          var latlong = coord.coordinates;
          var circle = L.circle(latlong, 500, {
            color: coord.color,
            fillColor: coord.color,
            fillOpacity: 0.5
          }).addTo(map);
        });
      }
    });

    $http.get('/3hun').success(function(data) {
      ui.tweets = data;
      ui.tweets.forEach(function(tweet) {
        var latlong = tweet.coordinates.coordinates.reverse();
        var circle = L.circle(latlong, 2000, {
          color: 'purple',
          fillColor: 'pink',
          fillOpacity: 0.75
        }).addTo(map2);
        circle.bindPopup(tweet.text)
      });
    });

    $http.get('/stats').success(function(data) {
      if(data) {
        ui.stats = angular.fromJson(data);
        console.log(ui.stats);
        var max = 0;
        for(var num in ui.stats.totals) {
          ui.categories.push(num);
          if(ui.stats.totals[num] > max) { max = ui.stats.totals[num]; }
        }
      }
    });

  }]);

}());
