<template>
  <div class="container mt-3">
    <ongoing-confirmation-card :hasOngoingMatch="hasOngoingMatch" :hasOngoingTournament="hasOngoingTournament"
      @start-new="startNew" v-if="step == 0"></ongoing-confirmation-card>
    <!-- <button type="button" class="btn btn-outline-success" @click="fillup">
      Fill up
    </button> -->
    <div class="mb-2" aria-details="Team names" v-if="step >= 1">
      <h3>Enter team names:</h3>
      <div class="row">
        <div v-for="(team, teamIndex) in allTeams" class="col-md-6" :class="'col-' +
          (teamIndex + 1 != allTeams.length || isSetTeamNames ? '12' : '9')
          ">
          <div class="form-floating mb-3">
            <input type="text" class="form-control" :id="'team-' + teamIndex + 1" placeholder="Rakib's team"
              v-model="allTeams[teamIndex].name" :disabled="isSetTeamNames" />
            <label :for="'team-' + teamIndex + 1">Team #{{ teamIndex + 1 }}</label>
          </div>
        </div>
        <div class="col-3 text-end" v-if="!isSetTeamNames">
          <button class="btn btn-lg btn-outline-info">
            <fa-icon icon="plus" title="Add more" @click="addIntoTeams" />
          </button>
        </div>
        <div class="col-md-3 mt-2 col-lg-2 d-grid">
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
        <div v-for="team in allTeams" class="col-md-6">
          <Accordion>
            <template #header>
              Team: &nbsp; <span class="fw-bold">{{ team.name }}</span>
            </template>
            <template #content>
              <input v-for="(player, index) in team.players" :key="index" type="text" class="form-control mb-1"
                :placeholder="'Player name #' + (parseInt(index) + 1)" v-model="team.players[index]"
                :disabled="hasTournamentBegun" @input="saveState" />
            </template>
          </Accordion>
        </div>
        <div class="col-md-3 col-lg-2 d-grid my-2">
          <button type="button" class="btn btn-outline-success" @click="startTournament" v-if="!hasTournamentBegun">
            Begin tournament
          </button>
          <button type="button" class="btn btn-secondary" @click="redoTournament" v-else>
            Re-entry
          </button>
        </div>
      </div>
    </div>
    <div class="mb-2" aria-details="Match setup" v-if="hasTournamentBegun && step >= 4">
      <h3>Select 2 playing teams:</h3>
      <div class="row gy-3">
        <div class="col-md-6" v-for="(playingTeam, index) in playingTeams">
          <label :for="'playing-team-' + index + 1">
            Team #0{{ index + 1 }}:
          </label>
          <select class="form-select mt-2" :id="'playing-team-' + index + 1" v-model="playingTeams[index]">
            <option v-for="team in allTeams" :value="team">
              {{ team.name }}
            </option>
          </select>
        </div>
        <div class="col-md-3 col-lg-2 d-grid my-2">
          <button type="button" class="btn btn-outline-success" @click="setPlayingTeams">
            Start match
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      hasTournamentBegun: false,
      teamSize: null,
      allTeams: [
        {
          name: "",
          players: [],
        },
      ],
      playingTeams: [],
      hasOngoingMatch: false,
      hasOngoingTournament: false,
    };
  },
  methods: {
    addIntoTeams() {
      this.allTeams.push({
        name: "",
        players: [],
      });
    },
    setTeamNames() {
      if (this.checkAllTeamNamesAreSet() && this.checkTeamNamesAreUnique()) {
        this.isSetTeamNames = true;
        if (this.isSetTeamSize) {
          this.resizeTeam();
        }
        this.step++;
        this.saveState();
      }
    },
    setTeamSize() {
      if (!this.teamSize || isNaN(this.teamSize)) {
        this.toastr$.error("Please set how many players will play per team.");
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
      this.allTeams.map((team) => {
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
      this.allTeams.map((team) => {
        for (
          let playerCount = team.players.length;
          playerCount > this.teamSize;
          playerCount--
        ) {
          team.players.pop();
        }
      });
    },
    startTournament() {
      if (
        this.checkAllTeamMembersAreSet() &&
        this.checkTeamMembersAreUnique()
      ) {
        this.step++;
        this.hasTournamentBegun = true;
        this.playingTeams = [
          {
            name: "",
            players: [],
          },
          {
            name: "",
            players: [],
          },
        ];
        this.saveState();
      }
    },
    editTeamNames() {
      this.isSetTeamNames = !this.isSetTeamNames;
      this.hasTournamentBegun = false;
      this.step--;
    },
    editTeamSize() {
      this.isSetTeamSize = !this.isSetTeamSize;
      this.hasTournamentBegun = false;
      this.step--;
    },
    redoTournament() {
      this.hasTournamentBegun = !this.hasTournamentBegun;
      this.step--;
    },
    setPlayingTeams() {
      const playing2Teams = this.playingTeams.filter((team) => {
        return team.name.trim() !== "";
      });
      const playingTeamNames = this.playingTeams.map((team) => team.name);

      const isDuplicate =
        new Set(playingTeamNames).size !== playing2Teams.length;
      if (playing2Teams.length !== 2) {
        this.toastr$.error("You must select 2 teams to start game.");
      } else if (isDuplicate) {
        this.toastr$.error("Two teams are same!");
      } else {
        this.saveState();
        this.$router.push({
          name: "ScoreBoard",
        });
      }
    },
    checkAllTeamNamesAreSet() {
      this.allTeams.map((team, index) => {
        if (team.name.trim() == "" && this.allTeams.length > 1) {
          this.allTeams.splice(index);
        }
      });
      if (this.allTeams.length < 2) {
        this.toastr$.error("A game must have at least 2 teams.");
        return false;
      }
      return true;
    },
    checkTeamNamesAreUnique() {
      const lowerCaseTeamNames = this.allTeams.map((team) =>
        team.name.toLowerCase()
      );

      const hasDuplicate =
        new Set(lowerCaseTeamNames).size !== this.allTeams.length;
      if (hasDuplicate) {
        this.toastr$.error("Set unique team names!");
        return false;
      }
      return true;
    },
    checkAllTeamMembersAreSet() {
      let allPlayers = [];
      let trimmedAllPlayers = [];
      this.allTeams.forEach((team) =>
        team.players.forEach((player) => {
          allPlayers.push(player.toLowerCase());
          if (player.trim() != "") {
            trimmedAllPlayers.push(player.toLowerCase());
          }
        })
      );

      const isLeftEmpty = trimmedAllPlayers.length != allPlayers.length;
      if (isLeftEmpty) {
        this.toastr$.error("Must entry all team players.");
        return false;
      }
      return true;
    },
    checkTeamMembersAreUnique() {
      let allPlayers = [];
      this.allTeams.forEach((team) =>
        team.players.forEach((player) => allPlayers.push(player.toLowerCase()))
      );
      let trimmedAllPlayers = allPlayers.map((player) => player.trim());
      const hasDuplicate =
        new Set(trimmedAllPlayers).size !== trimmedAllPlayers.length;
      if (hasDuplicate) {
        this.toastr$.error("Set unique player names!");
        return false;
      }
      return true;
    },
    saveState() {
      sessionStorage.setItem("hasOngoingTournament", JSON.stringify(true));
      sessionStorage.setItem("tournamentTeams", JSON.stringify(this.allTeams));
      sessionStorage.setItem("teamSize", JSON.stringify(this.teamSize));
      sessionStorage.setItem("playingTeams", JSON.stringify(this.playingTeams));
      sessionStorage.removeItem("hasOngoingMatch");
    },
    loadState() {
      const hasOngoingTournament = JSON.parse(sessionStorage.getItem('hasOngoingTournament')) ?? false;

      if (hasOngoingTournament) {
        const savedAllTeams = JSON.parse(
          sessionStorage.getItem("tournamentTeams")
        );
        if (savedAllTeams) {
          this.allTeams = savedAllTeams;
          this.isSetTeamNames = true;
          this.step = 2;
        }
        const savedTeamSize = JSON.parse(sessionStorage.getItem("teamSize"));
        if (savedTeamSize) {
          this.teamSize = savedTeamSize;
          this.isSetTeamSize = true;
          this.step = 3;
        }
        const savedPlayingTeams = JSON.parse(
          sessionStorage.getItem("playingTeams")
        );
        if (savedPlayingTeams && savedPlayingTeams.length) {
          this.hasTournamentBegun = true;
          this.step = 4;
          this.playingTeams = savedPlayingTeams;
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
