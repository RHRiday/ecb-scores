<template>
  <div>
    <nav class="navbar bg-body-tertiary navbar-light bg-light">
      <div class="container-fluid">
        <router-link to="/" class="navbar-brand">
          <img src="/cricket.svg" width="32px" />
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
              <img src="/cricket.svg" width="32px" />ECB
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <router-link to="/" class="nav-link">Home</router-link>
              </li>
              <li class="nav-item">
                <router-link to="/new-match" class="nav-link">New match</router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
