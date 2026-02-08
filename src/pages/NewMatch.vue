<template>
  <div class="container mt-3">
    <ongoing-confirmation-card :hasOngoingMatch="hasOngoingMatch" :hasOngoingTournament="hasOngoingTournament"
      @start-new="startNew" v-if="step == 0"></ongoing-confirmation-card>
    <div class="mb-2" aria-details="Team names" v-if="step >= 1">
      <h3>Enter team names:</h3>
      <div class="row">
        <div class="col-md-6" v-for="(team, index) in playingTeams">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" :id="'team-0' + index + 1" placeholder="Rakib's team"
              v-model="playingTeams[index].name" :disabled="isSetTeamNames" />
            <label :for="'team-0' + index + 1">Team #{{ index + 1 }}</label>
          </div>
        </div>
        <div class="col-md-3 col-lg-2 d-grid">
          <button type="button" class="btn btn-success" @click="setTeamNames" v-if="!isSetTeamNames">
            Set teams
          </button>
          <button type="button" class="btn btn-secondary" @click="editTeamNames" v-else>
            <fa-icon icon="pen-to-square" />
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2" aria-details="Team size" v-if="step >= 2">
      <h3>Players per team:</h3>
      <div class="row">
        <div class="col-md-6 gy-2">
          <input type="text" class="form-control" placeholder="For example: 11" v-model="teamSize"
            :disabled="isSetTeamSize" />
        </div>
        <div class="col-md-3 col-lg-2 d-grid gy-2">
          <button type="button" class="btn btn-success" @click="setTeamSize" v-if="!isSetTeamSize">
            Add team
          </button>
          <button type="button" class="btn btn-secondary" @click="editTeamSize" v-else>
            <fa-icon icon="pen-to-square" />
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2" aria-details="Team details" v-if="step >= 3">
      <h3>Enter player names:</h3>
      <div class="row gy-2">
        <div class="col-md-6" v-for="team in playingTeams">
          <Accordion>
            <template #header>
              Team: &nbsp; <span class="fw-bold">{{ team.name }}</span>
            </template>
            <template #content>
              <input v-for="(player, index) in team.players" :key="index" type="text" class="form-control mb-1"
                :placeholder="'Player name #' + (parseInt(index) + 1)" v-model="team.players[index]"
                @input="saveState" />
            </template>
          </Accordion>
        </div>
        <div class="col-md-3 col-lg-2 d-grid my-2">
          <button type="button" class="btn btn-outline-success" @click="startGame">
            Begin game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import _ from "lodash";
import Accordion from "../components/Accordion.vue";
import OngoingConfirmationCard from "../components/OngoingConfirmationCard.vue";
export default {
  components: { Accordion, OngoingConfirmationCard },
  beforeMount() {
    this.hasOngoingMatch =
      JSON.parse(localStorage.getItem("hasOngoingMatch")) ?? false;
    this.hasOngoingTournament =
      JSON.parse(localStorage.getItem("hasOngoingTournament")) ?? false;
    if (!this.hasOngoingMatch && !this.hasOngoingTournament) {
      this.step++;
    }
  },
  mounted() {
    this.loadState();
  },
  data() {
    return {
      step: 0,
      isSetTeamNames: false,
      isSetTeamSize: false,
      teamSize: null,
      playingTeams: [
        {
          name: "",
          players: [],
        },
        {
          name: "",
          players: [],
        },
      ],
      hasOngoingMatch: false,
      hasOngoingTournament: false,
    };
  },
  methods: {
    setTeamNames() {
      if (this.checkAllTeamNamesAreSet() && this.checkTeamNamesAreUnique()) {
        this.isSetTeamNames = true;
        this.step++;
        this.saveState();
      }
    },
    setTeamSize() {
      if (!this.teamSize || isNaN(this.teamSize)) {
        toastr.error("Please set how many players will play per team.");
      } else {
        this.isSetTeamSize = true;
        this.step++;
        this.resizeTeam();
        this.saveState();
      }
    },
    resizeTeam() {
      this.addPlayerIntoEachTeam();
      this.removePlayerFromEachTeam();
    },
    addPlayerIntoEachTeam() {
      this.playingTeams.map((team) => {
        for (
          let playerCount = team.players.length;
          playerCount < this.teamSize;
          playerCount++
        ) {
          team.players.push("");
        }
      });
    },
    removePlayerFromEachTeam() {
      this.playingTeams.map((team) => {
        for (
          let playerCount = team.players.length;
          playerCount > this.teamSize;
          playerCount--
        ) {
          team.players.pop();
        }
      });
    },
    editTeamNames() {
      this.isSetTeamNames = !this.isSetTeamNames;
      this.step--;
    },
    editTeamSize() {
      this.isSetTeamSize = !this.isSetTeamSize;
      this.step--;
    },
    startGame() {
      if (
        this.checkAllTeamMembersAreSet() &&
        this.checkTeamMembersAreUnique()
      ) {
        this.saveState();
        this.$router.push({
          name: "ScoreBoard",
        });
      }
    },
    checkAllTeamNamesAreSet() {
      const teamNames = this.playingTeams.filter((team) => {
        return team.name.trim() !== "";
      });
      if (teamNames.length < 2) {
        toastr.error("A game must have at least 2 teams.");
        return false;
      }
      return true;
    },
    checkTeamNamesAreUnique() {
      const lowerCaseTeamNames = this.playingTeams.map((team) =>
        team.name.toLowerCase()
      );

      const hasDuplicate =
        new Set(lowerCaseTeamNames).size !== this.playingTeams.length;
      if (hasDuplicate) {
        toastr.error("Set unique team names!");
        return false;
      }
      return true;
    },
    checkAllTeamMembersAreSet() {
      let allPlayers = [];
      let trimmedAllPlayers = [];
      this.playingTeams.forEach((team) =>
        team.players.forEach((player) => {
          allPlayers.push(player.toLowerCase());
          if (player.trim() != "") {
            trimmedAllPlayers.push(player.toLowerCase());
          }
        })
      );

      const isLeftEmpty = trimmedAllPlayers.length != allPlayers.length;
      if (isLeftEmpty) {
        toastr.error("Must entry all team players.");
        return false;
      }
      return true;
    },
    checkTeamMembersAreUnique() {
      let allPlayers = [];
      this.playingTeams.forEach((team) =>
        team.players.forEach((player) => allPlayers.push(player.toLowerCase()))
      );
      let trimmedAllPlayers = allPlayers.map((player) => player.trim());
      const hasDuplicate =
        new Set(trimmedAllPlayers).size !== trimmedAllPlayers.length;
      if (hasDuplicate) {
        toastr.error("Set unique player names!");
        return false;
      }
      return true;
    },
    saveState() {
      sessionStorage.setItem("hasOngoingMatch", JSON.stringify(true));
      sessionStorage.setItem("playingTeams", JSON.stringify(this.playingTeams));
      sessionStorage.setItem("teamSize", JSON.stringify(this.teamSize));
      sessionStorage.removeItem("hasOngoingTournament");
    },
    loadState() {
      const hasOngoingMatch = JSON.parse(sessionStorage.getItem('hasOngoingMatch')) ?? false;

      if (hasOngoingMatch) {
        const savedPlayingTeams = JSON.parse(
          sessionStorage.getItem("playingTeams")
        );
        if (savedPlayingTeams) {
          this.playingTeams = savedPlayingTeams;
          this.isSetTeamNames = true;
          this.step = 2;
        }
        const savedTeamSize = JSON.parse(sessionStorage.getItem("teamSize"));
        if (savedTeamSize) {
          this.teamSize = savedTeamSize;
          this.isSetTeamSize = true;
          this.step = 3;
        }
      }
    },
    startNew() {
      localStorage.clear();
      this.step = 1;
    },
  },
};
</script>
