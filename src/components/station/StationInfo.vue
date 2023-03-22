<template id="station-info">
  <div class="station-info">
    <v-card flat height="60vh" class="scroll">
      <v-card flat class="text-center" v-show="station === null">
        <station-list :features="features" :map="map" />
      </v-card>

      <v-card flat class="text-center" v-show="station !== null">
        <station-status :features="features" :map="map" />
      </v-card>
    </v-card>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import StationList from "./StationList.vue";
import StationStatus from "./StationStatus.vue";

export default defineComponent({
  components: { StationList, StationStatus },
  name: "StationInfo",
  template: "#station-info",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll;
}
</style>