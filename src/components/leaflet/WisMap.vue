<template id="wis-map">
  <div class="wis-map">
    <div v-if="loading">
      <v-progress-linear striped indeterminate color="primary" />
    </div>

    <v-toolbar>
      <v-toolbar-title>
        {{ station_name || $t("chart.station") }}
      </v-toolbar-title>

      <template v-slot:prepend>
        <v-btn :disabled="station === null" icon @click="features_.station = null">
          <v-icon icon="mdi-arrow-left" />
        </v-btn>
      </template>
    </v-toolbar>

    <div class="text-center">
      <v-row justify="center" fill-height no-gutters>
        <v-col :cols="smAndDown ? 12 : 5" :order="smAndDown ? 'last' : 'start'">
          <station-info :features="features" :map="map" class="ma-1" />
        </v-col>
        <v-col :cols="smAndDown ? 12 : 7">
          <v-card class="ma-1">
            <p>
              <l-map ref="wisMap" :zoom="zoom" :center="center" maxZoom="16" minZoom="2" style="height: 60vh"
                @ready="onReady()">
                <wis-station :features="features" :map="map" />
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-control position="topleft">
                  <v-menu open-on-hover>
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" icon="mdi-map-legend">
                      </v-btn>
                    </template>

                    <v-card class="legend pa-2" border="1">
                      <v-card-title class="mx-4">{{ $t("station.type") }}</v-card-title>
                      <v-row no-gutters justify="center" align="center" v-for="(item, i) in legend" :key="i">
                        <v-col cols="2" offset="1">
                          <i class="dot pl-1" :style="`background: ${item.color}`"> </i>
                        </v-col>
                        <v-col>
                          {{ item.type }}
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-menu>
                </l-control>
              </l-map>
            </p>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import { geoJSON } from "leaflet/dist/leaflet-src.esm";
import { LControl, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "../station/WisStation.vue";
import StationInfo from "../station/StationInfo.vue";
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LControl,
    LMap,
    LTileLayer,
    WisStation,
    StationInfo,
  },
  props: ["params", "features"],
  data: function () {
    return {
      numberMatched: 0,
      limit_: null,
      vals: {
        loading: true,
      },
      loading: true,
      map: undefined,
      features_: this.features,
      center: [0, 0],
      zoom: 1,
      attribution: window.VUE_APP_BASEMAP_ATTRIBUTION,
      url: window.VUE_APP_BASEMAP_URL,
      legend: [
        { "type": "Power Plant", "color": "#f44336" },
        { "type": "Power Plant Unit", "color": "#ff9800" },
        { "type": "Building", "color": "#ffeb3b" },
        { "type": "Pump Generating Plant", "color": "#8bc34a" },
        { "type": "Pump Generating Plant Unit", "color": "#009688" },
        { "type": "Lake/Reservoir", "color": "#2196f3" },
        { "type": "River/Stream", "color": "#673ab7" }
      ]
    };
  },
  computed: {
    items: function () {
      const opts = [10, 25, 50, 100, 150, 200];
      const items = new Set();

      for (const item of opts) {
        if (item < this.numberMatched) {
          items.add(item);
        }
      }
      items.add(this.numberMatched);
      return items;
    },
    smAndDown: function () {
      return this.$vuetify.display.smAndDown;
    },
    station: function () {
      return this.features_.station;
    },
    station_name: function () {
      if (this.station) {
        return this.station.properties.name;
      } else {
        return this.station;
      }
    },
  },
  methods: {
    onReady() {
      this.$nextTick(() => {
        this.map = this.$refs.wisMap.leafletObject;
        this.map.attributionControl.setPrefix("");
        this.map.zoomControl.setPosition("topright");
        this.loadStations();
      });
    },
    async loadStations() {
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: `${oapi}/collections/things/items`,
      })
        .then(function (response) {
          self.features_.stations = response.data;
          self.numberMatched = response.data.numberMatched;
          var bounds_ = geoJSON(response.data).getBounds();
          self.map.fitBounds(bounds_);
        })
        .catch(this.$root.catch)
        .then(function () {
          self.loading = false;
          setTimeout(self.loadStations, 900000);
        });
    },
  },
});
</script>

<style scoped>
.legend .dot {
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.8;
}
</style>
