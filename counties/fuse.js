var fs = require('fs');

var counties = JSON.parse(fs.readFileSync('geoCounties.json'));
var population = JSON.parse(fs.readFileSync('countyPop.json'));

console.log(counties.features[0]);
console.log(population[1].respop72014);

var matches = 0;
counties.features.forEach(function(feature) {
  population.forEach(function(county) {
    if(feature.properties.GEO_ID == county['GEO.id']) {
      console.log(county['GEO.display-label']+': '+county.respop72014);
      feature.properties['population'] = county.respop72014;
      matches++;
    }
  });
});

fs.writeFileSync('fusedCounties.json', JSON.stringify(counties));
console.log('matched '+matches+' out of '+population.length-1);
console.log(counties.features[0]);
