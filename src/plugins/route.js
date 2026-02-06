import {
  createRouter,
  createWebHashHistory,
} from "vue-router";
import Home from "../pages/Home.vue";
import NewMatch from "../pages/NewMatch.vue";
import NewTournament from "../pages/NewTournament.vue";
import ScoreBoard from "../pages/ScoreBoard.vue";
import About from "../pages/About.vue";

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
      title: "New Match",
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
  {
    path: "/about",
    name: "About",
    component: About,
    meta: {
      title: "About",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory("/ecb-scores/"),
  routes,
});

export default router;
