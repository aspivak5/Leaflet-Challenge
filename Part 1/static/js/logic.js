// var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//   tileSize: 512,
//   maxZoom: 18,
//   zoomOffset: -1,
//   id: "mapbox/streets-v11",
//   accessToken: API_KEY
// });

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "light-v10",
  accessToken: API_KEY
});

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "dark-v10",
  accessToken: API_KEY
});
var baseMaps = {
    "Street Map": lightmap,
    "Dark Map": darkmap
  };

  var myMap = L.map("map", {
    center: [32.09, -100.71],
    zoom: 4,
    layers: [lightmap]
  });
  
  // Pass our map layers into our layer control
  // Add the layer control to the map
  L.control.layers(baseMaps, {
  }).addTo(myMap);


  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  
  d3.json(url, function(data) {
    console.log(data)
    function Choosecolor(depth){
        if (depth > 90) {
            return  "#FF0000";
        }
        else if (depth > 70 && depth <= 90 ) {
            return "#DAA520";
        }
        else if (depth > 50 && depth <=70){
            return "#FFA500"; //orange
        }
        else if (depth > 30 && depth <=50){
            return  "#FFA07A";// light salmon
        }
        else if (depth > 10 && depth <=30){
            return "#90EE90" ; // light green 
        }
        else {
            return "#7CFC00"; // brighht green
        }
    };
    function markerSize(magnitude){
        // if (magnitude === 0){
        //     return 1;
        // }
        return magnitude * 3;
    }

    L.geoJson(data,{
        pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng);
        },
        style: function(feature){
            return {
                fillColor:Choosecolor(feature.geometry.coordinates[2]),
                radius: markerSize(feature.properties.mag),
                fillOpacity:1,
                color: "black",
                weight:1
            }
        },
        onEachFeature: function(feature,layer){
            layer.bindPopup(
                `Location: ${feature.properties.place} <br> Magnitude: ${feature.properties.mag} <br> Depth: ${feature.geometry.coordinates[2]}`
            )
        }
    }).addTo(myMap)

  });

  
  
