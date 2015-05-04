(function () {

  var app = angular.module('hateUI', []);

  app.factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });

  app.controller('graphics', ['$http', 'socket', function($http, socket) {
    var ui = this;
    ui.title = 'Categorical Statistics';
    ui.loaded = false;
    ui.showWords = false;
    ui.stats = {};
    ui.categories = {};
    ui.tweets = [];
    ui.keyColors = [];
    ui.mostRecent = {};
    ui.topTog = true;
    ui.fiveSecSum = 0;
    ui.fiveSecPer = 0;

    $http.get('/kwconf').success(function(data) {
      ui.categories = data;
      for(var key in data) {
        ui.keyColors.push(data[key].color);
      }
    });

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

    $http.get('/coords').success(function(data) {
      var dotLayers = [];
      var buckets = colorSort(data, ui.keyColors, 'color');
      var c = 0;
      for(var bucket in buckets) {
        dotLayers.push(new L.layerGroup());
        buckets[bucket].forEach(function(coord) {
          L.circle(coord.coordinates, 500, {
              color: coord.color,
              fillColor: coord.color,
              fillOpacity: 0.5
            }).addTo(dotLayers[c]);
        });
        c++;
      }
      delete data;
      var dots = L.layerGroup(dotLayers);

      var overlayDots = {}; k = 0;
      for(var category in ui.categories) {
        overlayDots[category] = dotLayers[k];
        k++;
      };

      var map = L.map('heat-map', { center: [38.50, -95.35], zoom: 4, layers: dotLayers });
      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      L.control.layers([],overlayDots).addTo(map);
      ui.loaded = true;
    });

    var map2 = L.map('mark-map').setView([38.50, -95.35], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map2);

    var drawTweet = function(tweet) {
      var latlong = tweet.coordinates.split(',').reverse();
      var circle = L.circle(latlong, 2000, {
        color: 'purple',
        fillColor: 'pink',
        fillOpacity: 0.75
      }).addTo(map2);
      circle.bindPopup('<p><a href=http://twitter.com/'+tweet.user+'/status/'+
        tweet.tweet_id+'>'+tweet.user+'</a>: '+tweet.text+
        '<strong>  | '+tweet.timestamp+'<p>');
    };

    $http.get('/3hun').success(function(data) {
      ui.tweets = data;
      ui.mostRecent = data[data.length-1].text;
      ui.tweets.forEach(function(tweet) { drawTweet(tweet) });
    });

    $http.get('/stats').success(function(data) { ui.stats = data; });


    socket.on('stats', function(data) {
      var preSum = 0;
      for(var n in ui.stats.totals) { preSum += ui.stats.totals[n]; }
      ui.stats = data;

      var newSum = 0;
      for(var n in ui.stats.totals) { newSum += ui.stats.totals[n]; }
      ui.fiveSecSum = newSum - preSum;
      ui.fiveSecPer = 100*(ui.fiveSecSum/(5*6000));
    });

    socket.on('located', function(data) {
      ui.tweets.push(data);
      ui.mostRecent = data.text;
      drawTweet(data);
    });

  }]);

}());
