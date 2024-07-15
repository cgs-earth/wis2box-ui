<template id="data-viewer">
  <div class="data-viewer">
    <v-card-title v-html="station.properties.name" />
    <v-layout>
      <v-app-bar color="#EEEEEE" flat>
        <template v-slot:prepend v-if="$vuetify.display.smAndDown">
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </template>
        <v-spacer />
        <v-tabs v-model="tab" end color="primary">
          <v-tab v-for="(item, i) in tabs" class="text-center pa-2" :value="i" :key="i">
            {{ $t(item) }}
          </v-tab>
        </v-tabs>
        <v-btn varaint="text" color="error" icon @click="$root.toggleDialog">
          <v-icon icon="mdi-close" />
        </v-btn>
      </v-app-bar>
      <data-navigation :choices="choices" :station="station" :alert="alert" :drawer="{ model: drawer }" />
      <v-main>
        <v-window v-model="tab">
          <v-window-item :value="0">
            <data-plotter :choices="choices" :alert="alert" />
          </v-window-item>
          <v-window-item :value="1">
            <data-table :choices="choices" :alert="alert" />
          </v-window-item>
        </v-window>
      </v-main>
    </v-layout>
  </div>
</template>

<script>
import DataPlotter from "./DataPlotter.vue";
import DataNavigation from "./DataNavigation.vue";
import DataTable from "./DataTable.vue";
let oapi = window.VUE_APP_OAPI;
import { defineComponent } from "vue";

export default defineComponent({
  name: "DataViewer",
  template: "#data-viewer",
  props: ["station"],
  components: {
    DataPlotter,
    DataNavigation,
    DataTable,
  },
  data() {
    return {
      drawer: true,
      tab: 0,
      tabs: ["chart.chart", "table.table"],
      choices: {
        collection: "",
        datastream: "",
        discovery_metadata: "",
        station: new Set([this.station]),
        stations: [],
        collections: [],
        datastreams: [],
      },
      alert: {
        value: false,
        msg: "",
      },
    };
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push("/");
    },
    async loadCollections() {
      var self = this;
      await this.$http({
        method: "get",
        url: `${oapi}/collections`
      })
        .then(function (response) {
          self.parseCollections(response.data.collections);
        })
        .catch(this.$root.catch);
    },
    async parseCollections(collections) {
      var self = this;
      for (var c of collections) {
        if (c.id === "things") {
          await this.$http({
            method: "get",
            url: oapi + "/collections/things/items",
          })
            .then(function (response) {
              self.choices.stations = response.data.features;
            })
            .catch(this.$root.catch);
        }
      }
      this.loading = false;
    }
  },
  watch: {
    "choices.datastream": {
      handler(datastream) {
        if (datastream !== "" && this.$vuetify.display.smAndDown) {
          this.drawer = false;
        }
      },
    },
  },
  mounted() {
    this.loading = true;
    this.loadCollections();
  },
});
</script>
