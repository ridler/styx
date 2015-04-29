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

    var count = 0; var colors = ['red', 'yellow', 'green', 'blue'];
    $http.get('/geoCounties.json').success(function(data) {
      L.geoJson(data, {
        style: function(feature) {
          var i = Math.ceil(9*Math.random());
          var c = '#FF'+i+''+i+''+i+'0';
          return {
            color: 'red',
            weight: 0.2
          };
        },
        onEachFeature: function(feature, layer) {
          layer.bindPopup(feature.properties.NAME);
        }
      }).addTo(map);

      ui.loaded = true;
    });

  }]);

}());
