import { createRouter, createWebHistory } from "vue-router";
import Map from "../views/Map.vue";
import Services from "../views/Services.vue";

const Authorize = {
  template: "<div>{{ $t('messages.authorize') }}</div>",
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: Map,
  },
  {
    path: "/services",
    name: "Services",
    component: Services,
  },
  {
    path: "/authorize",
    name: "Authorize",
    component: Authorize,
  },
  {
    path: "/:path",
    name: "Not Found",
    redirect: "/"
  },
];

const router = createRouter({
  history: createWebHistory(
    new URL(window.VUE_APP_URL).pathname
  ),
  routes,
});

export default router;
