// Store the API endpoint
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


// Creating the map as center of LA
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5
});

// Adding a tile layer to the map
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


// Set color and radius function
d3.json(queryUrl, function(data) {
  function styleInfo(feature) {
   return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "black",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5 
  };
}
  // set different color based on magnitude
  function getColor(magnitude) {
  switch (true) {
  case magnitude > 5:
    return "red";
  case magnitude > 4:
    return "orange";
  case magnitude > 3:
    return "yellow";
  case magnitude > 2:
    return "green";
  case magnitude > 1:
    return "blue";
  default:
    return "purple";
  }
}

  // Set radius based on magnitude
  function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 5;
}

  // Get geojson layout
  L.geoJson(data, {
    pointToLayer: function(feather, edata) {
      return L.circleMarker(edata);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(myMap);

  // Create the legend and set detail for it
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "purple",
      "blue",
      "green",
      "yellow",
      "orange",
      "red"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background: ' + colors[i] + '"></i> ' +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);

});