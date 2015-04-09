(function () {

  var app = angular.module('hateUI', []);
  app.controller('graphics', ['$http', function($http) {
    var ui = this;
    ui.title = 'Hate Speech Statistics';
    ui.stats = {};

    var update = function() {
      $http.get('/stats').success(function(data) {
        if(data) { ui.stats = angular.fromJson(data); }
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
    graph.maxValue = 200000;
    graph.margin = 2;
    graph.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
    graph.xAxisLabelArr = ["Racist", "Misogynistic", "Homophobic"];
    setInterval(function () {
      update();
      var nums = ui.stats.totals;
      graph.update([nums.racist, nums.misogynistic, nums.homophobic]);
    }, 7000);

    var live = createCanvas("graphDiv2");

    var g2 = new BarGraph(live);
    g2.maxValue = 50;
    g2.margin = 2;
    g2.colors = ["#49a0d8", "#d353a0", "#ffc527", "#df4c27"];
    g2.xAxisLabelArr = ["Racist", "Misogynistic", "Homophobic"];
    setInterval(function () {
      update();
      g2.update([Math.random()*50, Math.random()*50, Math.random()*50]);
    }, 1000);
  }]);

}());
