
<template id="app-msg">
  <div class="app-msg">
    <v-dialog v-model="snackbar" width="auto">
      <v-card>
        <v-card-text v-html="msg" />
        <v-card-actions>
          <v-btn color="pink" block @click="close()" v-html="$t('util.close')" />
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      snackbar: false,
    }
  },
  watch: {
    msg: function () {
      this.open();
    }
  },
  methods: {
    close() {
      this.snackbar = false;
      this.$root.msg = '';
    },
    open() {
      if (this.msg !== '') {
        this.snackbar = true;
      }
    }
  }
})
</script>
