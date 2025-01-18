<template id="station-list">
  <div class="station-list">
    <v-list lines="3">
      <v-hover v-slot="{ isHovering, props }">
        <template v-for="(s, i) in stations" :key="i">
          <v-list-item v-bind="props" height="50" :class="{ 'on-hover': isHovering }" @click="onClick(s)"
            @mouseover="onHover(s)">
            <template v-slot:prepend>
              <i class="dot" :style="`background: ${getColor(s)}`" />
            </template>

            <template v-slot:title>
              <h4 class="ml-3 text-left" v-text="s.properties.name" />
            </template>

          </v-list-item>
          <v-divider v-if="i + 1 < stations.length" />
        </template>
      </v-hover>
    </v-list>
  </div>
</template>

<script>
let oapi = window.VUE_APP_OAPI;

import { defineComponent } from "vue";

import { clean } from "@/scripts/helpers.js";

export default defineComponent({
  name: "StationList",
  template: "#station-list",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
    };
  },
  computed: {
    stations: function () {
      if (this.features.stations === null) {
        return [];
      } else {
        const stns = [...this.features.stations.features].sort((a, b) => {
          const nameA = a.properties.name.toUpperCase(); // ignore upper and lowercase
          const nameB = b.properties.name.toUpperCase(); // ignore upper and lowercase
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          } else {
            return 0;
          }
        });
        return stns;
      }
    },
  },
  methods: {
    clean,
    onClick(station) {
      this.features_.station = station;
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      this.map.flyTo(latlng);
    },
    onHover(station) {
      const latlng = [
        station.geometry.coordinates[1],
        station.geometry.coordinates[0],
      ];
      var url = `${oapi}/collections/things/items/${station.id}`;
      var content = `<a title="${station.id}" href="${url}">${station.properties.name}</a>`;
      this.map.openPopup(content, latlng);
    },
    getColor(station) {
      const colors = {
        "OWRD": "#f44336",
        // "Power Plant Unit": "#ff9800",
        // "Building": "#ffeb3b",
        // "Pump Generating Plant": "#8bc34a",
        "OREGONDEQ": "#009688",
        // "Lake/Reservoir": "#2196f3",
        "Other": "#673ab7"       
      }
      return colors[station.properties.organization] || "#673ab7";
    },
  },
});
</script>

<style scoped>
.dot {
  height: 16px;
  width: 16px;
  display: inline-block;
  border-radius: 50%;
  opacity: 0.8;
}
</style>