<template id="station-status">
  <div class="station-status">
    <v-table hover>
      <tbody>
        <tr v-for="(item, i) in recentObservations" :key="i">
          <td width="50%" class="text-center font-weight-bold">
            {{ getNameTime(item[0], item[1]) }}
          </td>
          <td width="50%">
            {{ item[1].properties.result + " " + symbol(item[0]) }}
            <br>
            <div class="text-caption">
              {{ $t("messages.from") + " " + get_time(item[1]) }}
            </div>
          </td>
        </tr>
      </tbody>
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
    };
  },
  watch: {
    "features_.station": {
      async handler(station) {
        if (station !== null) {
          this.recentObservations = [];
          this.loadObservations(station);
        } else {
          this.$root.catch(`
            ${station.properties.name} ${this.$t(
            "messages.no_linked_collections"
            )} <br> ${this.$t("messages.how_to_link_station")}`);
          this.loading = false;
          this.tab = null;
        }
      },
    },
  },
  methods: {
    getNameTime,
    get_time(obs) {
      if (obs.properties.resultTime) {
        return obs.properties.resultTime
      } else {
        return obs.properties.phenomenonTime
      }
    },
    symbol(datastream) {
      var UoM = datastream.properties.unitOfMeasurement;
      if (UoM && UoM.symbol && UoM.symbol !== 'none') {
        return datastream.properties.unitOfMeasurement.symbol;
      }
      return "";
    },
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
