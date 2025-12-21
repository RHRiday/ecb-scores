<template>
  <div class="card">
    <div class="card-header">You have an on going {{ selection }}!</div>
    <div class="card-body">
      <h5 class="card-title">
        <span v-for="(team, index) in teams">
          {{ team.name }}
          <span v-if="index < teams.length - 1"> vs </span>
        </span>
      </h5>
      <p class="card-text">Do you wish to continue the {{ selection }}?</p>
      <div
        class="card-footer d-flex flex-row-reverse justify-content-start gap-2"
      >
        <button
          class="col-auto btn btn-sm btn-primary flex-grow-0"
          @click="takeToScoreboard"
        >
          Continue
        </button>
        <button
          class="col-auto btn btn-sm btn-outline-danger flex-grow-0"
          @click="openNew"
        >
          Start new
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    hasOngoingMatch: {
      type: Boolean,
      required: true,
    },
    hasOngoingTournament: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      selection: "",
      teams: [],
    };
  },
  mounted() {
    if (this.hasOngoingMatch) {
      this.selection = "match";
      this.teams = JSON.parse(localStorage.getItem("playingTeams"));
    }
    if (this.hasOngoingTournament) {
      this.selection = "tournament";
      this.teams = JSON.parse(localStorage.getItem("tournamentTeams"));
    }
  },
  methods: {
    takeToScoreboard() {
      this.$router.push({
        name: "ScoreBoard",
      });
    },
    openNew() {
      this.$emit("start-new");
    },
  },
};
</script>
