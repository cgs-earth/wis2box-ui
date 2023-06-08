<template id="wis-station">
  <div class="wis-station">
    <div class="wis-station" style="display: none"></div>
  </div>
</template>

<script>
import { circleMarker, geoJSON } from "leaflet/dist/leaflet-src.esm";
import { MarkerClusterGroup } from "leaflet.markercluster/dist/leaflet.markercluster-src.js";

import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisStation",
  template: "#wis-station",
  props: ["features", "map"],
  data: function () {
    return {
      features_: this.features,
      geojsonOptions: {
        onEachFeature: this.onEachFeature,
        pointToLayer: this.pointToLayer,
      },
    };
  },
  mounted: function () {
    this.$nextTick(() => {
      this.onReady()
    })
  },
  methods: {
    onReady() {
      var markerCluster = new MarkerClusterGroup({
        maxClusterRadius: 10,
        chunkedLoading: true,
        chunkInterval: 500,
      });
      markerCluster.addLayer(new geoJSON(this.stations, this.geojsonOptions));
      this.map.addLayer(markerCluster);
    },
    mapClick(e) {
      this.features_.station = e.target.feature;
      this.features_.datastreams.length = 0;
      this.$root.toggleDialog();
      e.originalEvent.stopPropagation();
    },
    onEachFeature(feature, layer) {
      var self = this;
      var url = `${oapi}/collections/things/items/${feature.id}`;
      var content = `<a title="${feature.id}" href="${url}">${feature.properties.name}</a>`;
      layer.on("mouseover", function (e) {
        self.features_.station = feature;
        layer.bindPopup(content).openPopup(e.latLng);
      });
      layer.on({click: this.mapClick});
    },
    pointToLayer(feature, latLng) {
      const colors = {
        "Power Plant": "#f44336",
        "Power Plant Unit": "#ff9800",
        "Building": "#ffeb3b",
        "Pump Generating Plant": "#8bc34a",
        "Pump Generating Plant Unit": "#009688",
        "Lake/Reservoir": "#2196f3",
        "River/Stream": "#673ab7"
      }
      const markerStyle = {
        radius: 6,
        fillColor: colors[feature.properties.type],
        color: "#AAAAAA",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
      };
      return circleMarker(latLng, markerStyle);
    },
  },
  computed: {
    stations: function () {
      return this.features_.stations;
    },
  },
});
</script>
