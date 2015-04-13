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
          var circle = L.circle(latlong, 100, {
            color: coord.color,
            fillColor: coord.color,
            fillOpacity: 0.5
          }).addTo(map);
        });
      }
    });

    $http.get('/3hun').success(function(data) {
      ui.tweets = data;
      console.log(data[0]);
      ui.tweets.forEach(function(tweet) {
        var latlong = tweet.coordinates.coordinates.reverse();
        var circle = L.circle(latlong, 30000, {
          color: 'purple',
          fillColor: 'pink',
          fillOpacity: 0.75
        }).addTo(map2);
        circle.bindPopup(tweet.text)
      });
    });

    var update = function() {
      $http.get('/stats').success(function(data) {
        if(data) {
          ui.stats = angular.fromJson(data);
          var max = 0;
          for(var num in ui.stats.totals) {
            ui.categories.push(num);
            if(ui.stats.totals[num] > max) { max = ui.stats.totals[num]; }
          }
          graph.maxValue = max+200;
        }
      });
    };

    update();

    function createCanvas(divName) {

      var div = document.getElementById(divName);
      var canvas = document.createElement('canvas');
      div.appendChild(canvas);
      if (typeof G_vmlCanvasManager != 'undefined') {
        canvas = G_vmlCanvasManager.initElement(canvas);
      }
      var ctx = canvas.getContext("2d");
      return ctx;
    }

    var ctx = createCanvas("graphDiv1");

    var graph = new BarGraph(ctx);
    graph.margin = 1;
    graph.colors = ui.keyColors;
    graph.xAxisLabelArr = ui.categories;
    setInterval(function () {
      try {
        update();
        var nums = [];
        for(n in ui.stats.totals) { nums.push(ui.stats.totals[n]); }
        if(ui.stats != null) { graph.update(nums); }
      } catch(e) {}
    }, 5000);

    // var live = createCanvas("graphDiv2");

    // var g2 = new BarGraph(live);
    // g2.maxValue = 50;
    // g2.margin = 2;
    // g2.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
    // g2.xAxisLabelArr = ui.categories;
    // setInterval(function () {
    //   update();
    //   g2.update([Math.random()*50, Math.random()*50, Math.random()*50]);
    // }, 1000);
  }]);

}());
