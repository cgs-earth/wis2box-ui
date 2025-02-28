<template id="data-table">
  <div class="data-table">
    <v-card min-height="450px" class="ma-4">
      <v-alert v-show="alert.value" type="warning" v-html="alert.msg" />

      <div :style="{ visibility: loading ? 'visible' : 'hidden' }">
        <v-progress-linear striped indeterminate color="info" />
      </div>
      <div :style="{ visibility: !loading ? 'visible' : 'hidden' }">
        <v-container>
          <v-row justify="center" align="end">
            <div id="plotly-table" />
          </v-row>
        </v-container>
        <v-table v-show="title !== ''" fixed-header height="500px">
          <thead>
            <tr>
              <th class="text-center" v-html="$t('table.phenomenon_time')" />
              <th class="text-center" v-html="title" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(date, i) in data.time" :key="i">
              <td v-html="data.phenomenonTime[i]" />
              <td v-html="data.value[i]" />
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-card>
  </div>
</template>

<script>
import Plotly from "plotly.js-cartesian-dist-min";
import { defineComponent } from "vue";
import { mdiDownload } from "@mdi/js";

let oapi = window.VUE_APP_OAPI;

export default defineComponent({
  name: "DataTable",
  template: "#data-table",
  props: ["choices", "alert"],
  mounted: function () {
    this.$nextTick(() => {
      if (this.choices_.collection !== "" && this.choices_.datastream !== "") {
        for (var station of this.choices_.station) {
          this.loadCollection("observations", station);
        }
      }
    });
  },
  watch: {
    choices: {
      handler(newValue) {
        if (this.loading === true) {
          return;
        }
        this.loading = true;
        if (newValue.collection !== "" && newValue.datastream !== "") {
          this.data = {};
          for (var station of this.choices_.station) {
            this.loadCollection("observations", station);
          }
        }
        this.loading = false;
      },
      deep: true,
    },
  },
  data: function () {
    return {
      choices_: this.choices,
      data: {},
      loading: false,
      title: "",
      headerOverflow: 0,
      alert_: this.alert,
      layout: {
        height: 24,
        yaxis: {
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: "",
          showticklabels: false,
        },
        xaxis: {
          showgrid: false,
          zeroline: false,
          showline: false,
          ticks: "",
          showticklabels: false,
        },
      },
      config: {
        editable: false,
        responsive: true,
        displayModeBar: true,
        modeBarButtonsToAdd: [],
        modeBarButtonsToRemove: [
          "toImage",
          "resetScale2d",
          "zoom2d",
          "pan2d",
          "select2d",
          "lasso2d",
          "zoomIn2d",
          "zoomOut2d",
          "autoScale2d",
        ],
      },
    };
  },
  methods: {
    onScroll(e) {
      this.headerOverflow = e.target.scrollTop;
    },
    getCol(features, key) {
      if (key.includes(".")) {
        const split = key.split(".");
        if (split.length === 2) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]];
          });
        } else if (split.length === 3) {
          return features.map(function (row) {
            return row["properties"][split[0]][split[1]][split[2]];
          });
        }
      } else {
        return features.map(function (row) {
          return row["properties"][key];
        });
      }
    },
    async loadCollection(collection_id, station) {
      const datastream = this.choices_.datastream;

      this.alert_.msg =
        station.id + this.$t("messages.no_observations_in_collection");

      this.loading = true;
      var self = this;

      await this.$http({
        method: "get",
        url: `${oapi}/collections/${collection_id}/items`,
        params: {
          f: "json",
          Datastream: datastream.id,
          resulttype: "hits",
        },
      })
        .then(function (response) {
          // handle success
          self.loadObservations(
            collection_id,
            response.data.numberMatched,
            datastream
          );
        })
        .catch(this.$root.catch)
        .then(function () {
          console.log("done");
        });
    },
    async loadObservations(collection_id, limit, datastream) {
      if (limit === 0) {
        this.alert_.value = true;
        this.loading = false;
        return;
      } else {
        var self = this;
        this.loading = true;
        await this.$http({
          method: "get",
          url: `${oapi}/collections/${collection_id}/items`,
          params: {
            f: "json",
            Datastream: datastream.id,
            sortby: "-resultTime",
            limit: limit,
          },
        })
          .then(function (response) {
            // handle success
            self.plot(response.request.responseURL);
            self.title = `${datastream.name} (${datastream.units})`;
            self.data.value = self.getCol(response.data.features, "result");
            self.data.time = self.getCol(response.data.features, "resultTime");
            self.data.phenomenonTime = self.getCol(
              response.data.features,
              "phenomenonTime"
            );
          })
          .catch(this.$root.catch)
          .then(function () {
            self.loading = false;
            console.log("done");
          });
      }
    },
    plot(url) {
      var plot = document.getElementById("plotly-table");
      Plotly.purge(plot);
      this.config.modeBarButtonsToAdd = [
        {
          name: this.$t("chart.download"),
          icon: {
            width: 24,
            height: 24,
            path: mdiDownload,
          },
          click: function () {
            console.log(url.replace("f=json", "f=csv"));
            window.location.href = url.replace("f=json", "f=csv");
          },
        },
      ];
      Plotly.newPlot(plot, [], this.layout, this.config);
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
  text-align: center;
}
</style>
