<template>
  <div
    class="text-center d-flex flex-column justify-content-center"
    style="height: calc(100vh - 56px)"
  >
    <h1>Welcome to Elakar Cricket Board</h1>
    <p>A solution to keep track of scorecards of gully cricket!</p>
    <div class="col-12 mt-1">
      <router-link to="/new-match" class="btn btn-outline-dark"
        >Create a new match</router-link
      >
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
};
</script>
