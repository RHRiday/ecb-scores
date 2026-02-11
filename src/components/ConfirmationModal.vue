<template>
  <button type="button" class="btn btn-info" v-if="hasTrigger" @click="openModal">
    <fa-icon icon="toggle-on" />
  </button>
  <div class="modal fade" ref="confirmModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ header }}</h5>
        </div>
        <div class="modal-body" v-if="tounamentNextGame">
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
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" @click="closeModal">
            Close
          </button>
          <button v-if="!hasTrigger && !tounamentNextGame" type="button" class="btn btn-success" @click="goNext">
            Next match
          </button>
          <button v-if="hasTrigger" type="button" class="btn btn-success" @click="switchInnings">
            Switch
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import _ from "lodash";
import { Modal } from "bootstrap";

export default {
  emits: ["switch-innings", "next-match", "hide-result"],
  props: {
    hasTrigger: false,
    header: "",
  },
  data() {
    return {
      modal: null,
      tounamentNextGame: false,
      playingTeams: [],
      allTeams: [],
    };
  },
  mounted() {
    this.modal = new Modal(this.$refs.confirmModal, {
      backdrop: "static",
      keyboard: false,
    });
    if (!this.hasTrigger) {
      this.openModal();
    }
  },
  methods: {
    openModal() {
      this.modal.show();
    },
    switchInnings() {
      this.$emit("switch-innings");
      this.closeModal();
    },
    closeModal() {
      document.activeElement?.blur();
      this.$emit("hide-result");
      this.modal.hide();
    },
    goNext() {
      if (JSON.parse(localStorage.getItem("hasOngoingMatch"))) {
        this.closeModal();
        localStorage.clear();
        this.$router.push({
          name: "NewMatch",
        });
      }
      if (JSON.parse(localStorage.getItem("hasOngoingTournament"))) {
        this.tounamentNextGame = true;
        this.playingTeams = JSON.parse(localStorage.getItem("playingTeams"));
        this.allTeams = JSON.parse(localStorage.getItem("tournamentTeams"));
      }
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
        // this.$router.push({
        //   name: "ScoreBoard",
        // });
        this.$emit("next-match");
        this.tounamentNextGame = false;
        this.closeModal();
      }
    },
    saveState() {
      localStorage.removeItem("scorecard");
      sessionStorage.setItem("playingTeams", JSON.stringify(this.playingTeams));
    },
  },
};
</script>
