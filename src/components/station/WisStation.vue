<template id="wis-station">
  <div class="wis-station">
    <l-geo-json :geojson="stations" :options="geojsonOptions" @click="mapClick" />
  </div>
</template>

<script>
let oapi = window.VUE_APP_OAPI;

import { circleMarker } from "leaflet/dist/leaflet-src.esm";
import { LGeoJson } from "@vue-leaflet/vue-leaflet";

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisStation",
  template: "#wis-station",
  components: {
    LGeoJson,
  },
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
  methods: {
    mapClick(e) {
      this.features_.station = e.layer.feature;
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
        radius: 4,
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
