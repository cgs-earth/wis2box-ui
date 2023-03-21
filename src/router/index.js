import { createRouter, createWebHistory } from "vue-router";
import Map from "../views/Map.vue";
import Services from "../views/Services.vue";

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
];

const router = createRouter({
  history: createWebHistory(
    new URL(window.VUE_APP_URL).pathname
  ),
  routes,
});

export default router;
