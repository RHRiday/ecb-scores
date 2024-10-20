<template>
  <div class="container mt-3">
    <!-- <button type="button" class="btn btn-outline-success" @click="fillup">
      Fill up
    </button> -->
    <div class="mb-2" aria-details="Team names" v-if="step >= 1">
      <h3>Enter team names:</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="team-01"
              placeholder="Rakib's team"
              v-model="teamNames.t1"
              :disabled="isSetTeamNames"
            />
            <label for="team-01">Team #1</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-floating mb-3">
            <input
              type="text"
              class="form-control"
              id="team-02"
              placeholder="Shaafi's team"
              v-model="teamNames.t2"
              :disabled="isSetTeamNames"
            />
            <label for="team-02">Team #2</label>
          </div>
        </div>
        <div class="col-md-3 col-lg-2 d-grid">
          <button
            type="button"
            class="btn btn-success"
            @click="setTeamNames"
            v-if="!isSetTeamNames"
          >
            Set teams
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="editTeamName"
            v-if="isSetTeamNames"
          >
            <fa-icon icon="pen-to-square" />
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2" aria-details="Team size" v-if="step >= 2">
      <h3>Players per team:</h3>
      <div class="row">
        <div class="col-md-6 gy-2">
          <input
            type="text"
            class="form-control"
            placeholder="For example: 11"
            v-model="playersPerTeam"
            :disabled="isSetTeamSize"
          />
        </div>
        <div class="col-md-3 col-lg-2 d-grid gy-2">
          <button
            type="button"
            class="btn btn-success"
            @click="setTeamSize"
            v-if="!isSetTeamSize"
          >
            Add team
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="editTeamSize"
            v-if="isSetTeamSize"
          >
            <fa-icon icon="pen-to-square" />
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2" aria-details="Team details" v-if="step >= 3">
      <h3>Enter player names:</h3>
      <div class="row">
        <div class="col-md-6">
          <div class="col-12 border border-dark rounded p-3">
            <p>
              Team: <span class="fw-bold">{{ teamNames.t1 }}</span>
            </p>
            <input
              v-for="(player, index) in players"
              :key="index"
              type="text"
              class="form-control mb-1"
              placeholder="Player name"
              v-model="player.t1p"
            />
          </div>
        </div>
        <div class="col-md-6">
          <div class="col-12 border border-dark rounded p-3">
            <p>
              Team: <span class="fw-bold">{{ teamNames.t2 }}</span>
            </p>
            <input
              v-for="(player, index) in players"
              :key="index"
              type="text"
              class="form-control mb-1"
              placeholder="Player name"
              v-model="player.t2p"
            />
          </div>
        </div>
        <div class="col-md-3 col-lg-2 d-grid my-3">
          <button
            type="button"
            class="btn btn-outline-success"
            @click="startGame"
          >
            Begin game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
export default {
  data() {
    return {
      step: 1,
      isSetTeamNames: false,
      isSetTeamSize: false,
      playersPerTeam: null,
      teamNames: {
        t1: "",
        t2: "",
      },
      players: [],
    };
  },
  methods: {
    setTeamNames() {
      if (this.teamNames.t1 && this.teamNames.t2) {
        this.isSetTeamNames = true;
        if (this.step == "1") {
          this.step++;
        }
      } else {
        toastr.error("Please fill up team names.");
      }
    },
    setTeamSize() {
      if (this.playersPerTeam && !isNaN(this.playersPerTeam)) {
        this.isSetTeamSize = true;
        for (
          let playerCount = this.players.length;
          playerCount < this.playersPerTeam;
          playerCount++
        ) {
          this.players.push({ t1p: "", t2p: "" });
        }
        for (
          let playerCount = this.players.length;
          playerCount > this.playersPerTeam;
          playerCount--
        ) {
          this.players.pop();
        }
        if (this.step == "2") {
          this.step++;
        }
      } else {
        toastr.error("Please set how many players will play per team.");
      }
    },
    editTeamName() {
      this.isSetTeamNames = !this.isSetTeamNames;
    },
    editTeamSize() {
      this.isSetTeamSize = !this.isSetTeamSize;
    },
    startGame() {
      if (this.players.some((p) => !p.t1p || !p.t2p)) {
        toastr.error("Please entry players' names.");
      } else {
        if (this.finalCheck()) {
          sessionStorage.setItem("teams", JSON.stringify(this.teamNames));
          sessionStorage.setItem("players", JSON.stringify(this.players));
          this.$router.push({
            name: "ScoreBoard",
          });
        }
      }
    },
    fillup() {
      this.teamNames = {
        t1: "Shak",
        t2: "Jawad",
      };
      this.players = [
        { t1p: "Shak", t2p: "Jawad" },
        { t1p: "Rakib", t2p: "Noman" },
        { t1p: "Yousuf", t2p: "Johir" },
      ];
      this.isSetTeamNames = true;
      this.isSetTeamSize = true;
      this.playersPerTeam = 3;
      this.step = 3;
    },
    finalCheck() {
      if (this.teamNames.t1.toLowerCase() == this.teamNames.t2.toLowerCase()) {
        toastr.error("Please set different team names.");
        return false;
      } else if (
        this.players.some((p) => {
          return (
            this.players.some((p2) => p != p2 && p.t1p == p2.t1p) ||
            this.players.some((p2) => p != p2 && p.t2p == p2.t2p) ||
            this.players.some((p2) => p.t1p == p2.t2p) ||
            this.players.some((p2) => p.t2p == p2.t1p)
          );
        })
      ) {
        toastr.error("Please set different player names in a single team.");
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>
