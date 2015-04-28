(function () {

  var app = angular.module('countyUI', []);

  app.controller('graphics', ['$http', '$scope', function($http, $scope) {
    var ui = this;
    ui.loaded = false;
    ui.geodata = null;

    var map = L.map('county-map').setView([38.50, -95.35], 4);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    $http.get('/geoCounties.json').success(function(data) {
      console.log(data.features[0]);
      L.geoJson(data, {
        style: function(feature) {
          return {
            color: '#F8F'+Math.ceil(10*Math.random()+'0'),
            weight: 1
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
