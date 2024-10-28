<template id="app-header">
  <div class="app-header">
    <v-app-bar flat height="124" color="primary">

      <template v-slot:default>
        <v-responsive width="90%" max-width="1130" height="100%" class="mx-auto">
          <v-container fluid>
            <v-row fill-height>
              <a :href="provider" title="hub2box">
                <img :src="logo" style="height: 80px;" class="pl-6 my-3" />
              </a>
              <v-spacer />
              <app-settings class="ma-3" />
            </v-row>
          </v-container>
        </v-responsive>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
import AppSettings from "./AppSettings.vue";
import logo from "@/assets/img/logo.png";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  template: "#app-header",
  components: {
    AppSettings
  },
  data: function () {
    return {
      provider: "https://internetofwater.org/",
      logo: logo,
    };
  },
});
</script>
