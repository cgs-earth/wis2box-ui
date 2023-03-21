<template>
  <v-app id="v-app">
    <app-header app />

    <v-main>
      <v-responsive class="pa-2">
        <v-row justify="center">
          <v-card flat width="90%" max-width="1130">
            <v-layout>
              <app-nav />
              <v-main>
                <router-view />
              </v-main>
            </v-layout>
          </v-card>
        </v-row>
      </v-responsive>
    </v-main>

    <app-msg app class="pb-4" :msg="msg" />

    <app-footer app class="pt-4" />
  </v-app>
</template>

<script>
import AppFooter from "@/components/app/AppFooter.vue";
import AppHeader from "@/components/app/AppHeader.vue";
import AppMsg from "@/components/app/AppMsg.vue";
import AppNav from "@/components/app/AppNav.vue";

import { useI18n } from "vue-i18n";

export default {
  components: {
    AppFooter,
    AppHeader,
    AppNav,
    AppMsg
  },
  data() {
    return {
      msg: '',
      snackbar: false,
      dialog: false,
    };
  },
  methods: {
    toggleDialog: function () {
      this.dialog = this.dialog === true ? false : true;
    },
    catch: function (error) {
      this.msg = '';
      if (error.response.status === 401) {
        this.msg = this.t("messages.not_authorized");
      } else {
        this.msg = error;
      }
    }
  },
  setup() {
    const { t } = useI18n();
    return {
      t,
    };
  },
};
</script>
