<template id="token-auth">
  <div class="token-auth">
    <v-menu v-model="menu" :close-on-content-click="false">
      <template v-slot:activator="{ props }">
        <v-btn v-if="header" color="#FFFFFF" class="font-weight-bold" v-bind="props" v-html="$t('util.token')" />
        <v-btn v-else color="#274863" v-bind="props" v-html="$t('util.token')" />
      </template>
      <v-card>
        <v-card-text>
          <v-text-field v-model="token" type="password" single-line hide-details />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="onClose" v-html="$t('util.cancel')" />
          <v-btn text @click="saveToken" v-html="$t('util.save')" />
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "TokenAuth",
  template: "#token-auth",
  props: ["header"],
  data() {
    return { token: "", menu: false };
  },
  mounted() {
    this.saveToken();
  },
  watch: {
    "$root.token": function (token) {
      this.token = token;
    }
  },
  methods: {
    saveToken() {
      // Save token
      this.$root.token = this.token;
      this.onClose();
    },
    onClose() {
      // Reset token and close menu
      this.token = this.$root.token;
      this.menu = false;
    },
  },
});
</script>
