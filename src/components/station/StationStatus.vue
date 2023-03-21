<template id="station-status">
  <div class="station-status">
    <v-tabs grow v-model="tab" color="#014e9e">
      <v-tab v-for="(item, i) in tabs" :value="i" :key="i">
        {{ $t(item) }}
      </v-tab>
    </v-tabs>
    <v-divider />
    <v-window v-model="tab">
      <v-window-item :value="0" eager>
        <station-latest :features="features" :map="map" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import StationLatest from "./StationLatest.vue";

export default defineComponent({
  components: { StationLatest },
  name: "StationStatus",
  template: "#station-status",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      msg: "",
      tab: null,
      data: [],
      layout: {
        height: 300,
        width: 450,
        showlegend: false,
        xaxis: {
          type: "date",
        },
        yaxis: {
          dtick: 1,
        },
      },
      config: {
        displayModeBar: false,
        responsive: true,
      },
      tabs: ["station.latest"],
    };
  },
  computed: {
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
});
</script>
