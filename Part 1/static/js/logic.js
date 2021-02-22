//create layers for 2 different datasets 
var earthquakeLayer = new L.layerGroup();
var plateLayer = new L.layerGroup();

// create tile layers that we can select on map 
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
});

var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-v9",
  accessToken: API_KEY
});

//create basemaps object
var baseMaps = {
    "Light Map": lightmap,
    "Satellite": satellitemap,
    "Street Map":streetmap
  };

  // Create an overlay object
var overlay = {
    "Earthquakes":earthquakeLayer,
    "Tectonic Plates": plateLayer
}

// Create the map with our layers
  var myMap = L.map("map", {
    center: [32.09, -100.71],
    zoom: 4,
    layers: [lightmap]
  });
  
  // Pass map layers into our layer control
  // Add the layer control to the map
L.control.layers(baseMaps,overlay).addTo(myMap);

//url for earthquake data
  var Earthq_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

  //create function that determines the color of the circle based on depth
  function Choosecolor(depth){
    if (depth > 90) {
        return  "#fc0303";
    }
    else if (depth > 70) {
        return "#fc4a03";
    }
    else if (depth > 50){
        return "#fc9003"; 
    }
    else if (depth > 30){
        return  "#fcce03";
    }
    else if (depth > 10 ){
        return "#c6fc03" ; 
    }
    else {
        return "#5efc03"; 
    }
};
//create a function that determines the size of the radius based on magnitude 
function markerSize(magnitude){
    return magnitude * 3;
}
//perform api call
  d3.json(Earthq_url, function(data) {
    console.log(data)
    //add geojson layer and turn markers into circles 
     L.geoJson(data,{
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng);
        },
        //set the style for the circles 
        style: function(feature){
            return {
                fillColor:Choosecolor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag),
                fillOpacity:1,
                color: "black",
                weight:1
            }
        },
        //add a popup to show additional info when circle is clicked
        onEachFeature: function(feature,layer){
            layer.bindPopup(
                `Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`
            )
        }
        //add to earthquake layer
    }).addTo(earthquakeLayer);
  });
  //add earthquake layer to my map 
  earthquakeLayer.addTo(myMap);

  //create a legend control object
  var legend = L.control({
    position: "bottomright"
  });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [-10, 10, 30, 50, 70, 90];
    var colors = [];

    // Loop through intervals and generate a label with a colored square for each interval.
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: "
        + Choosecolor(grades[i]+1)
        + "'></i> "
        + grades[i]
        + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };

  //  add legend to the map.
  legend.addTo(myMap);


  var Plate_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
//perform api call on plate_url
  d3.json(Plate_url,function(data){
      console.log(data)
    //add geojson layer and style the tectonic plates
    L.geoJson(data,{
        color:"#e861cb",
        weight:2
        // add to platelayer
    }).addTo(plateLayer);
  });
  //add plate layer to map
  plateLayer.addTo(myMap);


  
  
