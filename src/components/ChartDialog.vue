<template id="chart-dialog">
  <div class="chart-dialog">
    <v-overlay v-model="$root.dialog" class="align-center justify-center">
      <div>
        <v-card :width="$vuetify.display.width" :max-height="$vuetify.display.height * 0.95" max-width="1100"
          class="pa-4 scroll">
          <v-responsive height="550">
            <data-viewer :station="station" />
          </v-responsive>
        </v-card>
      </div>
    </v-overlay>
  </div>
</template>

<script>
import DataViewer from "./data/DataViewer.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "ChartDialog",
  template: "#chart-dialog",
  components: {
    DataViewer,
  },
  props: ["features"],
  data: function () {
    return {
      features_: this.features,
    };
  },
  computed: {
    station: function () {
      return this.features_.station;
    },
    datastreams: function () {
      return this.features_.datastreams;
    },
  },
});
</script>

<style scoped>
.scroll {
  overflow-y: scroll
}
</style>
