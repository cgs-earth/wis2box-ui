<template id="station-status">
  <div class="station-status">
    <v-tabs grow v-model="tab" color="primary">
      <v-tab :value="0">
        {{ $t("station.latest") }}
        <v-icon end icon="mdi-history" />
      </v-tab>
      <v-tab @click.stop="openData(station)">
        {{ $t("navigation.data") }}
        <v-icon end icon="mdi-chart-scatter-plot" />
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
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
  },
  methods: {
    openData(station) {
      this.features_.station = station;
      this.$root.toggleDialog();
      this.$nextTick(() => {
        this.tab = 0; // Force the first tab to remain selected
      });
    },
  },
});
</script>
