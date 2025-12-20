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
          <button
            type="button"
            class="btn btn-info"
            @click="switchInnings"
            v-if="battingTeam && matchOngoing"
          >
            <fa-icon icon="toggle-on" />
          </button>
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
      <div aria-details="Switch batter" class="col-auto">
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
import _ from "lodash";
export default {
  components: { ScoreModal, ButtonTooltip },
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });
  },
  data() {
    return {
      $_: _,
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
      showScorecard: false,
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
  },
  methods: {
    switchInnings() {
      let permitted = window.confirm("Are you sure?");
      if (permitted) {
        this.selectedBattingNow = this.playingTeams.find(
          (team) => team.name != this.selectedBattingNow
        ).name;
        this.setBattingTeam();
      }
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
        sessionStorage.setItem("matchOngoing", true);
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
      this.updateStorage();
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
    checkSelectableScores(item) {
      return (
        this.selectedScores.includes(item) ||
        this.selectedScores.some((score) => score.show == ".") ||
        this.selectedScores.some((score) => {
          return (
            score.show == "wd" &&
            [".", "1", "2", "3", "4", "5", "6", "nb"].includes(item.show)
          );
        }) ||
        this.selectedScores.some((score) => {
          return score.show == "nb" && item.show != "ro";
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
      const popped = this.scores.pop();
      this.updateBatterRun();
      this.updateBowlerRun();
      if (popped.isBall) {
        this.scoreUpdates.pop();
      }
    },
    totalRun(battingTeam) {
      return this.scores
        .filter((s) => s.team == battingTeam)
        .reduce((sum, item) => sum + item.run, 0);
    },
    extraRun(battingTeam) {
      return this.scores
        .filter((s) => s.team == battingTeam && !s.isRunByBatsman)
        .reduce((sum, item) => sum + item.run, 0);
    },
    totalBalls(battingTeam) {
      return this.bowlers
        .filter((s) => s.team != battingTeam)
        .reduce((sum, item) => sum + item.balls, 0);
    },
    totalOvers(battingTeam) {
      return (
        Math.floor(this.totalBalls(battingTeam) / 6) +
        "." +
        (this.totalBalls(battingTeam) % 6)
      );
    },
    runRate(battingTeam) {
      return (this.totalRun(battingTeam) / this.totalBalls(battingTeam)) * 6;
    },
    updateStorage() {
      let scorecard = {
        batters: this.batters,
        bowlers: this.bowlers,
        battingTeam: this.battingTeam,
        selectedBatter: this.selectedBatter,
        selectedBowler: this.selectedBowler,
        scores: this.scores,
        scoreUpdates: this.scoreUpdates,
      };
      sessionStorage.setItem("scorecard", JSON.stringify(scorecard));
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
    this.playingTeams = JSON.parse(sessionStorage.getItem("playingTeams"));
    let savedScorecard = JSON.parse(sessionStorage.getItem("scorecard"));
    let matchOngoing = JSON.parse(sessionStorage.getItem("matchOngoing"));

    if (matchOngoing && savedScorecard) {
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
    }
  },
};
</script>
