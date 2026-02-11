import { createApp } from "vue";
import App from "./App.vue";
import router from "./plugins/route";
import { setupBackButton } from "./plugins/handleExit";
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
  faForwardStep,
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
import toastr from "toastr";
import { Capacitor } from "@capacitor/core";

library.add(
  faBaseballBall,
  faCheck,
  faCirclePlus,
  faClipboardList,
  faEarthAfrica,
  faForwardStep,
  faGithub,
  faHome,
  faPen,
  faPenToSquare,
  faPersonRunning,
  faPlus,
  faRotateLeft,
  faToggleOn,
  faUpload,
  faWalking,
);

toastr.options = {
  closeButton: false,
  debug: false,
  newestOnTop: false,
  progressBar: false,
  positionClass: Capacitor.isNativePlatform()
    ? "toast-bottom-center"
    : "toast-bottom-right",
  preventDuplicates: true,
  onclick: null,
  showDuration: "300",
  hideDuration: "500",
  timeOut: "3000",
  extendedTimeOut: "1000",
  showEasing: "swing",
  hideEasing: "linear",
  showMethod: "fadeIn",
  hideMethod: "fadeOut",
};
const app = createApp(App);
app.config.globalProperties.toastr$ = toastr;
app.use(router).component("fa-icon", FontAwesomeIcon).mount("#app");
setupBackButton(router);
