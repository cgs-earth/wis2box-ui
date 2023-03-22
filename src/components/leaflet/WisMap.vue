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
                <l-geo-json :geojson="path" />
                <l-tile-layer :url="url" :attribution="attribution" />
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
import { LGeoJson, LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

import WisStation from "../station/WisStation.vue";
import StationInfo from "../station/StationInfo.vue";
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

export default defineComponent({
  name: "WisMap",
  template: "#wis-map",
  components: {
    LGeoJson,
    LMap,
    LTileLayer,
    WisStation,
    StationInfo,
  },
  props: ["params", "features"],
  data: function () {
    return {
      path: null,
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
        {
          color: "#009900",
          range: "20 or more",
        },
        {
          color: "#FF9900",
          range: "8 - 19",
        },
        {
          color: "#FF3300",
          range: "1 - 7",
        },
        {
          color: "#708090",
          range: "None",
        },
      ],
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
        this.loadPath();
        this.loadStations();
      });
    },
    async loadPath() {
      const response = await fetch("https://merit.internetofwater.app/processes/river-runner/execution?lng=-105.82&lat=40.24&groupby=nameid,streamlev,levelpathi&sorted=downstream");
      const data = await response.json();
      this.path = await data.value;
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
