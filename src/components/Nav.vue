<template>
  <div>
    <nav class="navbar bg-body-tertiary navbar-light bg-light">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">
          <img src="./../../public/cricket.svg" width="32px" />
          ECB</router-link
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="mainNavbar"
          aria-labelledby="mainNavbarLabel"
        >
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="mainNavbarLabel">
              <img src="./../../public/cricket.svg" width="32px" />ECB
            </h5>
            <button
              type="button"
              id="close-offcanvas"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li v-for="route in configuredRoutes" class="nav-item">
                <router-link
                  :to="route.path"
                  class="nav-link alert"
                  :class="{ 'alert-info': $route.name == route.name }"
                  @click="closeOffcanvas"
                  >{{ route.meta.title }}</router-link
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import router from "./../router/route.js";
export default {
  name: "Nav",
  data() {
    return {
      configuredRoutes: router.getRoutes(),
    };
  },
  methods: {
    closeOffcanvas() {
      document.getElementById("close-offcanvas").click();
    },
  },
};
</script>
