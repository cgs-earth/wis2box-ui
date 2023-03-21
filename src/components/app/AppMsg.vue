
<template id="app-msg">
  <div class="app-msg">
    <v-snackbar v-model="snackbar">
      {{ msg }}
      <template v-slot:actions>
        <v-btn color="pink" size="small" variant="text" @click="snackbar = false" v-html="$t('util.close')" />
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DataNavigation",
  template: "#data-navigation",
  props: ["msg"],
  data: function () {
    return {
      snackbar: false
    }
  },
  watch: {
    msg: function () {
      this.snackbar = !this.snackbar;
    }
  }
})
</script>
