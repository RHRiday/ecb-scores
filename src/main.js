import { createApp } from "vue";
import App from "./App.vue";
import router from "./plugins/route";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "toastr/build/toastr.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faBaseballBall,
  faCheck,
  faCirclePlus,
  faClipboardList,
  faEarthAfrica,
  faHome,
  faPen,
  faPenToSquare,
  faPersonRunning,
  faPlus,
  faRotateLeft,
  faToggleOn,
  faUpload,
  faWalking,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

library.add(
  faBaseballBall,
  faCheck,
  faCirclePlus,
  faClipboardList,
  faEarthAfrica,
  faHome,
  faPen,
  faPenToSquare,
  faPersonRunning,
  faPlus,
  faRotateLeft,
  faToggleOn,
  faUpload,
  faWalking,
  faGithub,
);
createApp(App).use(router).component("fa-icon", FontAwesomeIcon).mount("#app");
