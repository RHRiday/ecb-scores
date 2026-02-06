<template>
  <div class="container mt-3">
    <div class="mb-2" aria-details="Toss">
      <h3>Batting team<span v-if="!battingTeam">?</span></h3>
      <div class="row gy-2">
        <template v-for="(team, index) in playingTeams" :key="index">
          <div
            class="col-md-3 col-lg-2 d-grid"
            v-if="battingTeam == '' || battingTeam.name == team.name"
          >
            <button
              type="button"
              class="btn"
              :class="{
                'btn-info':
                  selectedBattingNow == team.name && battingTeam == '',
                'btn-success': battingTeam.name == team.name,
                'btn-outline-secondary': selectedBattingNow != team.name,
              }"
              @click="selectedBattingNow = team.name"
              :disabled="battingTeam != ''"
            >
              {{ team.name }}
              <fa-icon
                v-if="battingTeam.name == team.name"
                icon="earth-africa"
              />
            </button>
          </div>
        </template>
        <div class="col-md-3 col-lg-2 d-grid">
          <button
            type="button"
            class="btn btn-success"
            @click="setBattingTeam"
            v-if="!battingTeam"
            :disabled="selectedBattingNow == ''"
          >
            <fa-icon icon="check" />
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="battingTeam = ''"
            v-if="battingTeam && !matchOngoing"
          >
            <fa-icon icon="pen-to-square" />
          </button>
          <ConfirmationModal
            :hasTrigger="true"
            header="Confirm switch innings?"
            @switch-innings="switchInnings"
            v-if="battingTeam && !isTargetSet && matchOngoing"
          />
          <div class="alert alert-info" v-if="isTargetSet">
            Target: {{ target }}
          </div>
          <ConfirmationModal
            :header="'Match won by ' + wonBy"
            v-if="isMatchWon"
          />
        </div>
      </div>
    </div>
    <div
      class="row mb-2 gy-2 justify-content-around"
      aria-details="Match functions"
      v-if="battingTeam"
    >
      <h3 class="col-12">Functions:</h3>
      <ScoreModal
        :header="'Choose batters'"
        :secondButtonClass="'primary'"
        :modalCondition="battingTeam"
        :tooltipIcons="['walking', 'plus']"
        v-if="!isMatchWon"
      >
        <template #selectOption>
          <div
            class="col-auto d-grid"
            v-for="(player, index) in battingTeam.players"
            :key="index"
          >
            <button
              type="button"
              class="btn"
              :class="[
                batters.some((batter) => batter.name == player) ||
                selectedBatter == player
                  ? 'btn-info'
                  : 'btn-outline-secondary',
              ]"
              :disabled="batters.some((batter) => batter.name == player)"
              @click="selectBatter(player)"
            >
              {{ player }}
            </button>
          </div>
        </template>
        <template #setOptions>
          <button type="button" class="btn btn-primary" @click="setBatters">
            <fa-icon icon="circle-plus" /> Add
          </button>
        </template>
      </ScoreModal>
      <ScoreModal
        :header="'Choose bowler'"
        :secondButtonClass="'primary'"
        :modalCondition="bowlingTeam"
        :tooltipIcons="['person-running', 'baseball-ball']"
        v-if="!isMatchWon"
      >
        <template #selectOption>
          <div
            class="col-auto d-grid"
            v-for="(player, index) in bowlingTeam.players"
            :key="index"
          >
            <button
              type="button"
              class="btn"
              :class="[
                selectedBowler == player ? 'btn-info' : 'btn-outline-secondary',
              ]"
              @click="selectBowler(player)"
            >
              {{ player }}
            </button>
          </div>
        </template>
        <template #setOptions
          ><button type="button" class="btn btn-primary" @click="setBowlers">
            <fa-icon icon="check" /> Select
          </button></template
        >
      </ScoreModal>
      <ScoreModal
        :header="'Set score'"
        :secondButtonClass="'warning'"
        :modalCondition="canSetScore"
        :tooltipIcons="['pen', 'clipboard-list']"
        v-if="!isMatchWon"
      >
        <template #selectOption
          ><div
            class="col-auto d-grid"
            v-for="(item, index) in availableScores"
            :key="index"
          >
            <button
              type="button"
              class="btn btn-dark"
              @click="addScore(item)"
              :disabled="checkSelectableScores(item)"
            >
              {{ item.show }}
            </button>
          </div>
        </template>
        <template #setOptions>
          <button type="button" class="btn btn-danger" @click="undoScore">
            <fa-icon icon="rotate-left" /> Undo
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="setScore"
            :disabled="batsmanInPitch.length != 2"
          >
            <fa-icon icon="plus" /> Add
          </button>
        </template>
      </ScoreModal>
      <div aria-details="Undo previous" class="col-auto">
        <button type="button" class="btn btn-danger" @click="undoPrevScore">
          <button-tooltip
            :header="'Undo last score'"
            :icons="['rotate-left', 'clipboard-list']"
          />
        </button>
      </div>
      <div aria-details="Switch batter" class="col-auto" v-if="!isMatchWon">
        <button
          type="button"
          class="btn btn-primary"
          @click="switchBatter"
          :disabled="batters.length < 1 || batsmanInPitch < 2"
        >
          <button-tooltip
            :header="'Switch batsman'"
            :icons="['toggle-on', 'walking']"
          />
        </button>
      </div>
      <div aria-details="Export scorecard" class="col-auto">
        <button type="button" class="btn btn-info" @click="exportToJson">
          <button-tooltip
            :header="'Download scoresheet'"
            :icons="['upload', 'clipboard-list']"
          />
        </button>
      </div>
    </div>
    <div
      class="mb-2"
      aria-details="Scorecard"
      v-if="matchOngoing && showScorecard"
    >
      <h3 class="my-2">Scorecard:</h3>
      <ul class="nav nav-tabs" role="tablist">
        <li
          class="nav-item col-6 col-md-auto"
          v-for="(team, teamN) in playingTeams"
          :key="teamN"
        >
          <button
            type="button"
            role="tab"
            class="nav-link w-100"
            data-bs-toggle="tab"
            :data-bs-target="'#' + $_.kebabCase(team.name) + '_scorecard'"
          >
            {{ team.name }}
          </button>
        </li>
      </ul>
      <div class="tab-content">
        <div
          v-for="(team, teamN) in playingTeams"
          :key="teamN"
          class="tab-pane fade py-3"
          :id="$_.kebabCase(team.name) + '_scorecard'"
        >
          <div class="row fw-bold">
            <div class="col-1">#</div>
            <div class="col-4">Batsman</div>
            <div class="col-2">Run</div>
            <div class="col-2">Balls</div>
            <div class="col-3">S/R</div>
          </div>
          <div
            class="row my-1 rounded"
            v-for="(batter, index) in batters.filter(
              (b) => b.team == team.name
            )"
            :class="{
              'bg-info bg-gradient': batsmanInPitch.some(
                (batsman) => batsman.name == batter.name
              ),
            }"
            :key="index"
          >
            <div class="col-1">
              {{ index + 1 }}
            </div>
            <div class="col-4">
              {{ batter.name + markOnCurrentBatsman(batter.name) }}
            </div>
            <div class="col-2">
              {{ batter.run }}
            </div>
            <div class="col-2">
              {{ batter.balls }}
            </div>
            <div class="col-3">
              {{ ((batter.run / batter.balls) * 100).toFixed(2) }}
            </div>
          </div>
          <div
            class="row my-3 fw-bold border border-dark border-end-0 border-start-0"
          >
            <div class="col-5">
              Extras:
              {{ extraRun(team.name) }}
            </div>
            <div class="col-2">Runs</div>
            <div class="col-2">Overs</div>
            <div class="col-3">Run Rate</div>
            <div class="col-5">Total</div>
            <div class="col-2">
              {{ totalRun(team.name) }}
            </div>
            <div class="col-2">
              {{ totalOvers(team.name) }}
            </div>
            <div class="col-3">
              {{ runRate(team.name).toFixed(2) }}
            </div>
            <h6
              v-if="scoreUpdates.length > 0"
              class="col-12 d-flex align-items-center my-2"
              style="gap: 0.5rem"
            >
              <span class="flex-shrink-0">Ball by ball:</span>
              <span class="overflow-auto d-flex" style="gap: 0.5rem">
                <span
                  v-for="lastBall in reversedScoreUpdates"
                  class="badge bg-dark flex-shrink-0"
                  >{{ lastBall }}
                </span>
              </span>
            </h6>
          </div>
          <div class="row fw-bold">
            <div class="col-1">#</div>
            <div class="col-4">Bowler</div>
            <div class="col-2">Overs</div>
            <div class="col-2 d-none d-md-block">Runs/Wickets</div>
            <div class="col-2 d-md-none">R/Wkt</div>
            <div class="col-3">Econ</div>
          </div>
          <div
            class="row"
            v-for="(bowler, index) in bowlers.filter(
              (b) => b.team != team.name
            )"
            :class="{
              'bg-warning bg-gradient': bowler.name == selectedBowler,
            }"
            :key="index"
          >
            <div class="col-1">
              {{ index + 1 }}
            </div>
            <div class="col-4">
              {{ bowler.name }}
            </div>
            <div class="col-2">
              {{ Math.floor(bowler.balls / 6) + "." + (bowler.balls % 6) }}
            </div>
            <div class="col-2">{{ bowler.run }}/{{ bowler.wickets }}</div>
            <div class="col-3">
              {{ ((bowler.run / bowler.balls) * 6).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from "toastr";
import availableHits from "../router/availableHits.js";
import { Tooltip } from "bootstrap";
import { saveAs } from "file-saver";
import ScoreModal from "../components/ScoreModal.vue";
import ButtonTooltip from "../components/ButtonTooltip.vue";
import ConfirmationModal from "../components/ConfirmationModal.vue";
import _ from "lodash";
export default {
  components: { ScoreModal, ButtonTooltip, ConfirmationModal },
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });
    this.loadState();
  },
  data() {
    return {
      $_: _,
      tournamentTeams: [],
      playingTeams: [],
      selectedBattingNow: "",
      battingTeam: "",
      batters: [],
      bowlers: [],
      players: [],
      selectedBatter: "",
      selectedBowler: "",
      availableScores: availableHits,
      selectedScores: [],
      scores: [],
      scoreUpdates: [],
      matchOngoing: false,
      tournamentOngoing: false,
      showScorecard: false,
      isTargetSet: false,
      isMatchWon: false,
    };
  },
  computed: {
    bowlingTeam() {
      if (this.battingTeam) {
        return this.playingTeams.find(
          (team) => team.name != this.battingTeam.name
        );
      } else {
        return "";
      }
    },
    batsmanInPitch() {
      return this.batters.filter((batter) => {
        return !batter.isOut && batter.team == this.battingTeam.name;
      });
    },
    bowlersUsed() {
      return this.bowlers.filter((bowler) => {
        return bowler.team == this.bowlingTeam.name;
      });
    },
    canSetScore() {
      return this.batsmanInPitch.length >= 2 && this.bowlersUsed.length > 0;
    },
    reversedScoreUpdates() {
      return this.scoreUpdates.slice().reverse();
    },
    target() {
      return this.totalRun(this.bowlingTeam.name) + 1;
    },
    wonBy() {
      if (this.isMatchWon) {
        const teamRuns = this.playingTeams.map((team) => {
          return {
            teamName: team.name,
            run: this.totalRun(team.name),
          };
        });
        return teamRuns.reduce((prev, current) =>
          prev.run > current.run ? prev.teamName : current.teamName
        );
      }
    },
  },
  methods: {
    switchInnings() {
      this.selectedBattingNow = this.playingTeams.find(
        (team) => team.name != this.selectedBattingNow
      ).name;
      this.setBattingTeam();
      this.isTargetSet = true;
      this.updateState();
    },
    setBattingTeam() {
      this.selectedBatter = "";
      this.selectedBowler = "";
      this.battingTeam = this.playingTeams.find(
        (team) => team.name == this.selectedBattingNow
      );
    },
    selectBatter(player) {
      if (this.batsmanInPitch.length < 2) {
        this.selectedBatter = player;
      } else {
        toastr.error("Two batsman already in pitch.");
      }
    },
    setBatters() {
      if (!this.batters.some((batter) => batter.name == this.selectedBatter)) {
        this.batters.push({
          name: this.selectedBatter,
          run: 0,
          balls: 0,
          isOut: false,
          outBy: "",
          team: this.battingTeam.name,
        });
        this.matchOngoing = true;
      }
      if (this.batsmanInPitch.length >= 2) {
        document.getElementById("close-choose-batters").click();
      }
      if (this.canSetScore) {
        this.showScorecard = true;
      }
    },
    selectBowler(player) {
      this.selectedBowler = player;
    },
    setBowlers() {
      if (!this.bowlers.some((bowler) => bowler.name == this.selectedBowler)) {
        this.bowlers.push({
          name: this.selectedBowler,
          balls: 0,
          run: 0,
          wickets: 0,
          team: this.bowlingTeam.name,
        });
      }
      document.getElementById("close-choose-bowler").click();
      if (this.canSetScore) {
        this.showScorecard = true;
      }
    },
    addScore(item) {
      if (!this.selectedScores.includes(item)) {
        this.selectedScores.push(item);
      }
    },
    undoScore() {
      this.selectedScores = [];
    },
    setScore() {
      this.adjustDeliveryCount();
      this.addToLastDelivery();
      this.addDeliveryToScore();
      this.updateBatterRun();
      this.updateBowlerRun();
      this.checkSwitchBatsman();
      this.checkMatchEnd();
      this.updateState();
      this.selectedScores = [];

      document.getElementById("close-set-score").click();
    },
    addDeliveryToScore() {
      const hits = this.selectedScores.map((score) => {
        return {
          ...score,
          runBy: this.selectedBatter,
          bowlBy: this.selectedBowler,
          team: this.battingTeam.name,
        };
      });

      hits.forEach((hit) => {
        this.scores.push(hit);
      });
    },
    updateBatterRun() {
      this.batters = this.batters.map((batsman) => {
        return {
          ...batsman,
          run: 0,
          balls: 0,
          isOut: false,
          outBy: "",
        };
      });
      this.scores.forEach((r) => {
        if (r.isRunByBatsman) {
          this.batters = this.batters.map((batsman) => {
            if (batsman.name == r.runBy) {
              return { ...batsman, run: batsman.run + r.run };
            } else {
              return { ...batsman };
            }
          });
        }
        if (r.isBall) {
          this.batters = this.batters.map((batsman) => {
            if (batsman.name == r.runBy) {
              return { ...batsman, balls: batsman.balls + 1 };
            } else {
              return { ...batsman };
            }
          });
        }
        if (r.isOut) {
          this.batters = this.batters.map((batsman) => {
            if (batsman.name == r.runBy) {
              return {
                ...batsman,
                outBy: this.selectedBowler,
                isOut: true,
              };
            } else {
              return { ...batsman };
            }
          });
        }
      });
    },
    updateBowlerRun() {
      this.bowlers = this.bowlers.map((bowler) => {
        return {
          ...bowler,
          run: 0,
          balls: 0,
          wickets: 0,
        };
      });
      this.scores.forEach((r) => {
        if (r.isRunByBowler) {
          this.bowlers = this.bowlers.map((bowler) => {
            if (bowler.name == r.bowlBy) {
              return { ...bowler, run: bowler.run + r.run };
            } else {
              return { ...bowler };
            }
          });
        }
        if (r.isBall) {
          this.bowlers = this.bowlers.map((bowler) => {
            if (bowler.name == r.bowlBy) {
              return { ...bowler, balls: bowler.balls + 1 };
            } else {
              return { ...bowler };
            }
          });
        }
        if (r.isOut) {
          this.bowlers = this.bowlers.map((bowler) => {
            if (bowler.name == r.bowlBy && r.show != "ro") {
              return { ...bowler, wickets: bowler.wickets + 1 };
            } else {
              return { ...bowler };
            }
          });
        }
      });
    },
    checkMatchEnd() {
      const outBatsmen = this.batters.filter((batsman) => {
        return batsman.team == this.battingTeam.name && batsman.isOut;
      }).length;
      const allOut = outBatsmen + 1 >= this.battingTeam.players.length;
      const targetReached =
        this.totalRun(this.battingTeam.name) >
        this.totalRun(this.bowlingTeam.name);
      if (this.isTargetSet && (targetReached || allOut)) {
        this.isMatchWon = true;
      }
    },
    adjustDeliveryCount() {
      if (
        this.selectedScores.some((score) => ["wd", "nb"].includes(score.show))
      ) {
        this.selectedScores = this.selectedScores.map((s) => {
          return { ...s, isBall: false };
        });
      }
    },
    addToLastDelivery() {
      const show = this.selectedScores.map((s) => s.show).join(" ");
      this.scoreUpdates.push(show);
    },
    markOnCurrentBatsman(batsman) {
      return this.selectedBatter == batsman ? " *" : "";
    },
    markOnCurrentBatsman(batsman) {
      return this.selectedBatter == batsman ? " *" : "";
    },
    checkSelectableScores(item) {
      return (
        this.selectedScores.includes(item) ||
        this.selectedScores.some((score) => {
          return [".", "w", "ro"].includes(score.show);
        }) ||
        this.selectedScores.some((score) => {
          return score.isBall && (item.isBall || item.show == "wd");
        }) ||
        this.selectedScores.some((score) => {
          return (
            score.show == "wd" &&
            [".", "1", "2", "3", "4", "5", "6", "nb"].includes(item.show)
          );
        }) ||
        this.selectedScores.some((score) => {
          return score.show == "nb" && [".", "wd", "w"].includes(item.show);
        })
      );
    },
    checkSwitchBatsman() {
      if (
        this.selectedScores.some((score) =>
          ["1", "3", "5", "1b", "3b", "5b"].some((s) => s == score.show)
        )
      ) {
        this.switchBatter();
      }
    },
    switchBatter() {
      let nonStrike = this.batsmanInPitch.find((batter) => {
        return batter.name != this.selectedBatter && !batter.isOut;
      });
      this.selectedBatter = nonStrike.name;
    },
    undoPrevScore() {
      this.isMatchWon = false;
      const popped = this.scores.pop();
      this.updateBatterRun();
      this.updateBowlerRun();
      if (popped.isBall) {
        this.scoreUpdates.pop();
      }
    },
    totalRun(team) {
      return this.scores
        .filter((s) => s.team == team)
        .reduce((sum, item) => sum + item.run, 0);
    },
    extraRun(team) {
      return this.scores
        .filter((s) => s.team == team && !s.isRunByBatsman)
        .reduce((sum, item) => sum + item.run, 0);
    },
    totalBalls(team) {
      return this.bowlers
        .filter((s) => s.team != team)
        .reduce((sum, item) => sum + item.balls, 0);
    },
    totalOvers(team) {
      return (
        Math.floor(this.totalBalls(team) / 6) +
        "." +
        (this.totalBalls(team) % 6)
      );
    },
    runRate(team) {
      return (this.totalRun(team) / this.totalBalls(team)) * 6;
    },
    updateState() {
      let scorecard = {
        batters: this.batters,
        bowlers: this.bowlers,
        battingTeam: this.battingTeam,
        selectedBatter: this.selectedBatter,
        selectedBowler: this.selectedBowler,
        scores: this.scores,
        scoreUpdates: this.scoreUpdates,
        isTargetSet: this.isTargetSet,
        isMatchEnd: this.isMatchWon,
      };
      sessionStorage.setItem("scorecard", JSON.stringify(scorecard));
    },
    loadState() {
      let savedScorecard = JSON.parse(localStorage.getItem("scorecard"));
      if (savedScorecard) {
        this.batters = savedScorecard.batters;
        this.bowlers = savedScorecard.bowlers;
        this.battingTeam = savedScorecard.battingTeam;
        this.selectedBattingNow = savedScorecard.battingTeam.name;
        this.selectedBatter = savedScorecard.selectedBatter;
        this.selectedBowler = savedScorecard.selectedBowler;
        this.scores = savedScorecard.scores ?? [];
        this.scoreUpdates = savedScorecard.scoreUpdates ?? [];
        this.matchOngoing = true;
        this.showScorecard = true;
        this.isTargetSet = savedScorecard.isTargetSet;
        this.checkMatchEnd();
      }
    },
    exportToJson() {
      let scorecard = {
        batters: this.batters,
        bowlers: this.bowlers,
      };
      const blob = new Blob([JSON.stringify(scorecard, null, 2)], {
        type: "application/json",
      });
      saveAs(blob, "scorecard-" + Math.floor(Math.random() * 100) + ".json");
    },
  },
  created() {
    Object.keys(sessionStorage).forEach((key) => {
      localStorage.setItem(key, sessionStorage.getItem(key));
    });
    this.matchOngoing = JSON.parse(localStorage.getItem("hasOngoingMatch"));
    this.tournamentOngoing = JSON.parse(
      localStorage.getItem("hasOngoingTournament")
    );
    if (!this.matchOngoing && !this.tournamentOngoing) {
      toastr.error("Please start a new match or a tournament!");
      this.$router.push({
        name: "Home",
      });
    } else if (this.tournamentOngoing) {
      this.tournamentTeams =
        JSON.parse(localStorage.getItem("tournamentTeams")) ?? [];
    }

    this.playingTeams = JSON.parse(localStorage.getItem("playingTeams"));

    if (this.matchOngoing || this.tournamentOngoing) {
      this.loadState();
      sessionStorage.clear();
    }
  },
};
</script>
