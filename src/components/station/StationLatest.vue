<template id="station-status">
  <div class="station-status">
    <h5 class="text-left">
      {{ $t("messages.from") + " " + latestResultTime }}
    </h5>
    <v-table>
      <table>
        <tr v-for="(item, i) in recentObservations" :key="i">
          <th width="50%">{{ getNameTime(item[0], item[1]) }}</th>
          <td width="50%">
            {{ item[1].properties.result + " " + item[0].properties.unitOfMeasurement.symbol }}
          </td>
        </tr>
      </table>
    </v-table>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import { getNameTime } from "@/scripts/helpers.js";

export default defineComponent({
  name: "StationLatest",
  template: "#station-latest",
  props: ["features", "map"],
  data() {
    return {
      features_: this.features,
      recentObservations: [],
      latestResultTime: null,
    };
  },
  watch: {
    "features_.station": {
      async handler(station) {
        if (station !== null) {
          this.latestResultTime = null;
          this.recentObservations = [];
          this.loadObservations(station);
        }
      },
    },
  },
  methods: {
    getNameTime,
    async loadObservations(station) {
      var self = this;
      for (const datastream of station.properties.Datastreams) {
        await this.$http({
          method: "get",
          url: datastream,
        })
          .then(function (response) {
            // handle success
            self.loadRecentObservations(response.data);
          })
          .catch(this.$root.catch)
          .then(function () {
            self.tab = 0;
            self.loading = false;
            console.log("done");
          });
      }
    },
    async loadRecentObservations(datastream) {
      this.loading = true;
      var self = this;
      if (datastream.properties.Observations.length === 0) {
        return
      }
      await this.$http({
        method: "get",
        url: datastream.properties.Observations[0]
      }).then(function (response) {
        // handle success
        self.latestResultTime = response.data.properties.resultTime;
        self.recentObservations.push([datastream, response.data]);
      })
        .catch(this.$root.catch);
    },
  },
});
</script>

<style scoped>
tr:nth-child(odd) {
  background-color: #eeeeee;
}

th,
td {
  padding: 8px;
}
</style>
