import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/Home.vue";
import NewMatch from "../pages/NewMatch.vue";
import NewTournament from "../pages/NewTournament.vue";
import ScoreBoard from "../pages/ScoreBoard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      title: "Home",
    },
  },
  {
    path: "/new-match",
    name: "NewMatch",
    component: NewMatch,
    meta: {
      title: "New match",
    },
  },
  {
    path: "/new-tournament",
    name: "NewTournament",
    component: NewTournament,
    meta: {
      title: "New Tournament",
    },
  },
  {
    path: "/scoreboard",
    name: "ScoreBoard",
    component: ScoreBoard,
    meta: {
      title: "Scoreboard",
    },
  },
];

const router = createRouter({
  history: createWebHistory("/ecb-scores/"),
  routes,
});

export default router;
