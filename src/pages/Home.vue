<template>
  <div
    class="text-center d-flex flex-column justify-content-center"
    style="height: calc(100vh - 120px)"
  >
    <h6>Welcome to</h6>
    <h1>Elakar Cricket Board</h1>
    <p>A solution to keep track of scorecards of gully cricket!</p>
    <p>Made by Rifat Hossen Riday</p>
    <div class="col-12 my-2">
      <router-link to="/new-match" class="btn btn-outline-dark"
        >Create a new match</router-link
      >
    </div>
    <div class="col-12 my-2">
      <router-link to="/new-tournament" class="btn btn-outline-dark"
        >Open a new tournament</router-link
      >
    </div>
  </div>
</template>
<script>
export default {};
</script>
