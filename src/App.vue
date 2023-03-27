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

    <app-msg app class="pb-4" :error="error" />

    <app-footer app class="pt-4" />
  </v-app>
</template>

<script>
import AppFooter from "@/components/app/AppFooter.vue";
import AppHeader from "@/components/app/AppHeader.vue";
import AppMsg from "@/components/app/AppMsg.vue";
import AppNav from "@/components/app/AppNav.vue";

let oapi = window.VUE_APP_OAPI;

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
      error: {
        msg: '',
        status: 200,
      },
      dialog: false,
      token: '',
      interceptor: null
    };
  },
  watch: {
    token: function (t) {
      // Clear headers and apply token
      const interceptors = this.axios.interceptors.request;
      if (this.interceptor !== null) {
        interceptors.eject(this.interceptor);
      }
      this.interceptor = interceptors.use(function (config) {
        config.headers = { Authorization: `Bearer ${t}` };
        config.baseURL = oapi;
        return config;
      });

      // Handle close
      this.error.msg = '';
      this.$router
        .push('/services')
        .then(() => { this.$router.go(-1) });
    }
  },
  methods: {
    toggleDialog: function () {
      this.dialog = this.dialog === true ? false : true;
    },
    catch: function (error) {
      if (typeof error.response.status === "number") {
        this.error.status = error.response.status;
      }
      if (error.response.status === 401) {
        this.error.msg = this.t("messages.not_authorized");
      } else {
        this.error.msg = error;
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
