<template id="app-footer">
  <div class="app-footer">
    <v-footer flat height="110" color="primary">
      <v-row justify="center" align="center">
        <v-col class="primary text-center" cols="12">
          <p style="color:white;">
            {{ $t("footer.powered_by") }}
            <a style="color:white;" :title="name" :href="home" v-html="name" />
            {{ version }}
          </p>
        </v-col>
        <a href="https://cgsearth.org" title="cgs">
          <img :src="poweredbycgs" style="height: 40px;" />
        </a>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
import { name, version, homepage } from "../../../package";
import poweredbycgs from "@/assets/img/poweredbycgs.png";

import { defineComponent } from "vue";

export default defineComponent({
  name: "AppFooter",
  template: "#app-footer",
  data: function () {
    return {
      version: version,
      name: name,
      home: homepage,
      poweredbycgs: poweredbycgs
    };
  },
});
</script>
