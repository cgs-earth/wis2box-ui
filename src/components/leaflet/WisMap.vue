<template id="wis-map">
  <div class="wis-map" >
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
              <l-map
                ref="wisMap"
                :zoom="zoom"
                :center="center"
                maxZoom="16"
                minZoom="2"
                style="height: 60vh"
                @ready="onReady()"
              >
                <template v-if="!loading">
                  <wis-station :features="features" :map="map" />
                </template>
                <l-tile-layer :url="url" :attribution="attribution" />
                <l-control position="topleft">
                  <v-card class="legend" width="200">
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-title>
                          <v-icon class="pr-2" icon="mdi-map-legend" />
                          {{ $t('station.type') }} 
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-row no-gutters justify="center" align="center" v-for="(item, i) in legend" :key="i">
                            <v-divider v-if="i !== 0" />
                            <v-col cols="2" offset="1">
                              <i class="dot pl-1 mt-1" :style="`background: ${item.color}`"> </i>
                            </v-col>
                            <v-col class="py-1">
                              {{ item.type }}
                            </v-col>
                          </v-row>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
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
        { "type": "OWRD", "color": "#f44336" },
        // { "type": "Power Plant Unit", "color": "#ff9800" },
        // { "type": "Building", "color": "#ffeb3b" },
        // { "type": "Pump Generating Plant", "color": "#8bc34a" },
        { "type": "OREGONDEQ", "color": "#009688" },
        // { "type": "Lake/Reservoir", "color": "#2196f3" },
        { "type": "Other", "color": "#673ab7" }
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
      this.$root.loading = true;
      this.loading = true;
      var self = this;
      await this.$http({
        method: "get",
        url: `${oapi}/collections/things/items`,
      })
        .then(function (response) {
          self.features_.stations = response.data;
          self.numberMatched = response.data.numberMatched;
        })
        .catch(this.$root.catch)
        .then(function () {
          var bounds_ = geoJSON(self.features_.stations).getBounds();
          self.map.fitBounds(bounds_);
        })
        .catch(function () {
          self.$root.catch(`
            <p>${self.$t("messages.does_not_exist")}</p>
            <p>${self.$t("messages.how_to_link_station")}</p>`);
        })
        .then(function () {
          self.$root.loading = false;
          self.loading = false;
          // setTimeout(self.loadStations, 900000);
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
