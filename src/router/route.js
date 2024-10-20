import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import NewMatch from "../pages/NewMatch.vue";
import ScoreBoard from "../pages/ScoreBoard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/new-match",
    name: "NewMatch",
    component: NewMatch,
  },
  {
    path: "/scoreboard",
    name: "ScoreBoard",
    component: ScoreBoard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
