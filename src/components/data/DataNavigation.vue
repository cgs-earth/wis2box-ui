<template id="data-navigation">
  <div class="data-navigation">
    <v-navigation-drawer v-model="drawer_" bottom absolute class="text-center">
      <v-list-item-subtitle class="mt-2" v-html="$t('chart.observed_property')" />
      <v-list nav>
        <template v-for="(item, i) in choices.datastreams" :key="i" class="mr-3">
          <v-list-item :value="i" active-color="secondary" :active="model === i" @click="updateData(item, i)">
            {{ getNameTime(item[0], item[1]) }}
          </v-list-item>
          <v-divider class="pb-1 mx-2" v-if="i < choices.datastreams.length - 1" />
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { getNameTime, hasLinks } from "@/scripts/helpers.js";

export default {
  name: "DataNavigation",
  template: "#data-navigation",
  props: ["choices", "alert", "station", "drawer"],
  data() {
    return {
      choices_: this.choices,
      alert_: this.alert,
      model: -1,
    };
  },
  computed: {
    drawer_: function () {
      return this.drawer.model;
    },
  },
  mounted: function () {
    if (hasLinks(this.station)) {
      for (const item of this.station.properties.Datastreams) {
        this.updateCollection(item);
      }
    }
  },
  watch: {
    "choices.station": {
      handler(station) {
        if (hasLinks(station)) {
          for (const item of station.properties.Datastreams) {
            this.updateCollection(item);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    getNameTime,
    async updateCollection(collection_url) {
      this.alert_value = false;
      this.choices_.collection = collection_url;
      var self = this;
      await this.$http({
        method: "get",
        url: collection_url,
      })
      .then(function (response) {
          // handle success
          self.getCollectionItem(response.data)
        })
        .catch(this.$root.catch)
        .then(function () {
          self.loading = false;
          console.log("done");
        });
    },
    async getCollectionItem(datastream) {
      if (datastream.properties.Observations.length === 0) {
        return
      }
      var self = this;
      await this.$http({
        method: "get",
        url: datastream.properties.Observations[0]
      })
        .then(function (response) {
          self.choices_.datastreams.push([datastream, response.data]);
        })
        .catch(this.$root.catch)
        .then(function () {
          console.log("done");
        });
    },
    updateData(newD, index) {
      this.choices_.datastream = {
        title: newD[0].properties.name,
        index: index,
        id: newD[0].id,
        name: getNameTime(newD[0], newD[1]),
        units: this.symbol(newD[0]),
      };
      this.model = index;
    },
    symbol(datastream) {
      if (datastream.properties.unitOfMeasurement) {
        return datastream.properties.unitOfMeasurement.symbol
      }
    },
  },
};
</script>
