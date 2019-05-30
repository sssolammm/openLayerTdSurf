
// import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';
// import Select from 'ol/interaction/Select.js';



var map;

var mapLat = 40.416775;
var mapLng = -3.703790;
var mapDefaultZoom = 6;

$( document ).ready(function() {
  initialize_map();
});

function initialize_map() {
  map = new ol.Map({
    target: "map",
    layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM({
          url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          // imagerySet: 'Aerial'
      })
    })
    ],
    view: new ol.View({
      center: ol.proj.fromLonLat([mapLng, mapLat]),
      //minZoom: 9,
      //maxZoom: 13,
      zoom: mapDefaultZoom
    })
  });

  var jqxhr = $.getJSON( "../json/coordinates.json", function(data) {
    $.each(data.coodinatesArray, function(idx, obj) {
      add_map_point(obj.lat, obj.lng, obj.name, obj.url);
    });
  });
  //add_map_point(43.4092831, -2.7036664);
}

function add_map_point(lat, lng, beachName, url) {
  var vectorLayer = new ol.layer.Vector({
    source:new ol.source.Vector({
      features: [new ol.Feature({
        name: beachName,
        url: url,
        geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
      })]
    }),
      style: new ol.style.Style({
        image: new ol.style.Icon({
          anchor: [0.5, 0.5],
          anchorXUnits: "fraction",
          anchorYUnits: "fraction",
          //size: [250, 200],
          scale: 0.015,
          src: "/images/icon_marker.svg"
          //src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
        }),
        text: new ol.style.Text({
          font: '12px Calibri,sans-serif',
          fill: new ol.style.Fill({ color: '#000' }),
          stroke: new ol.style.Stroke({
            color: '#fff', width: 2
          }),
          // text: map.getView().getZoom() > 10 ? "hi" : 'Bye'
          // get the text from the feature - `this` is ol.Feature
          // and show only under certain resolution
          //text: map.getView().getZoom() > 8 ? beachName : ''
        })
    })
  });
  map.addLayer(vectorLayer);
  map.on('moveend', onMoveEnd);

  map.on('click', function(evt) {
    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature, layer) {
        window.open(feature.N.url);
      });
  });
}

function onMoveEnd(evt) {
  var mapEvent = evt.map;

  if (mapEvent.getView().getZoom() < 6) {
    removeAllFeature();
  } else {
    if (map.getLayers().getArray().length == 1) {
      var jqxhr = $.getJSON( "../json/coordinates.json", function(data) {
        $.each(data.coodinatesArray, function(idx, obj) {
          add_map_point(obj.lat, obj.lng, obj.name, obj.url);
        });
      });
    }
  }

}

//Vector only
function removeAllFeature() {
  var layerArray, len, layer;
  layerArray = map.getLayers().getArray(),
  len = layerArray.length;

  for (var i = 0; i < len; i++) {
    layer = layerArray[i];
    if (layer.type == 'VECTOR') {
      map.removeLayer(layer);
    }
  }
}