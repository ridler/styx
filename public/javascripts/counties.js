(function () {

  var app = angular.module('countyUI', []);

  app.directive('loadingCircle', function() {
    return {
      restrict: 'E',
      templateUrl: 'templates/loading-circle.html'
    }
  });

  app.controller('graphics', ['$http', '$scope', function($http, $scope) {
    var ui = this;
    ui.loaded = false;

    var map = L.map('county-map').setView([38.50, -95.35], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $http.get('/talliedCounties.json').success(function(data) {

      var colors = ['#FFC0C0', '#FF8080', '#FF4040', '#FF0000'];
      var colorCode = {'#FFFFFF': {'sequence': 0, 'range': [0, 0]}};
      var seq = 1;
      colors.forEach(function(color) {
        colorCode[color] = {
          'sequence': seq++,
          'range': null
        };
      });
      delete seq; delete colors;

      var max = 0;
      data.features.forEach(function(county) {
        if(county.properties.ratio > max) {
          max = county.properties.ratio;
        }
      });

      var scalor = max/4; var bounds = [0];
      for(var i = 1; i <= 4; i++) {
        bounds.push(bounds[i-1]+scalor);
        for(var color in colorCode) {
          if(colorCode[color].sequence == i) {
            colorCode[color].range = [bounds[i-1], bounds[i-1]+scalor]
          }
        }
      }

      L.geoJson(data, {
        style: function(feature) {

          var c = '';
          if(feature.properties.ratio == 0) { c = '#FFFFFF'; }
          else {
            for(var color in colorCode) {
              if(feature.properties.ratio >= colorCode[color].range[0] &&
                  feature.properties.ratio <= colorCode[color].range[1]) {
                c = color;
              }
            }
          }
          return {
            color: c,
            weight: 0.2
          };
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup('<p>'+feature.properties.NAME+'</p>'+
            '<p>'+feature.properties.population+'</p>'+
            '<p>'+feature.properties.ratio+'</p>');
        }
      }).addTo(map);

      ui.loaded = true;
    });

  }]);

}());
