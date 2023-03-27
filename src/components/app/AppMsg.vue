
<template id="app-msg">
  <div class="app-msg">
    <v-dialog v-model="snackbar" width="auto">
      <v-card>
        <v-card-text v-html="error.msg" />
        <v-card-actions>
          <v-row justify="center">
            <token-auth v-if="error.status === 401" />
            <v-btn color="pink" @click="close()" v-html="$t('util.close')" />
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { defineComponent } from "vue";

import TokenAuth from "./TokenAuth.vue";


export default defineComponent({
  name: "AppMsg",
  template: "#app-msg",
  props: ["error"],
  components: {
    TokenAuth,
  },
  data: function () {
    return {
      snackbar: false,
    }
  },
  watch: {
    "error.msg": function () {
      this.open();
    }
  },
  methods: {
    close() {
      this.snackbar = false;
      this.$root.error.msg = '';
    },
    open() {
      if (this.error.msg !== '') {
        this.snackbar = true;
      } else {
        this.snackbar = false;
      }
    }
  }
})
</script>
