<template>
  <div class="container mt-3">
    <div class="mb-2" aria-details="Toss">
      <h3>Who is batting now?</h3>
      <div class="row gy-2">
        <div
          class="col-md-3 col-lg-2 d-grid"
          v-if="battingNow == '' || battingNow == teams.t1"
        >
          <button
            type="button"
            class="btn"
            :class="{
              'btn-info': selectBatFirst == teams.t1 && battingNow == '',
              'btn-success': battingNow == teams.t1,
              'btn-outline-secondary': selectBatFirst != teams.t1,
            }"
            @click="selectBatFirst = teams.t1"
            :disabled="battingNow != ''"
          >
            {{ teams.t1 }}
            <fa-icon v-if="battingNow == teams.t1" icon="earth-africa" />
          </button>
        </div>
        <div
          class="col-md-3 col-lg-2 d-grid"
          v-if="battingNow == '' || battingNow == teams.t2"
        >
          <button
            type="button"
            class="btn"
            :class="{
              'btn-info': selectBatFirst == teams.t2 && battingNow == '',
              'btn-success': battingNow == teams.t2,
              'btn-outline-secondary': selectBatFirst != teams.t2,
            }"
            @click="selectBatFirst = teams.t2"
            :disabled="battingNow != ''"
          >
            {{ teams.t2 }}
            <fa-icon v-if="battingNow == teams.t2" icon="earth-africa" />
          </button>
        </div>
        <div class="col-md-3 col-lg-2 d-grid">
          <button
            type="button"
            class="btn btn-success"
            @click="setBatFirst"
            v-if="!battingNow"
          >
            <fa-icon icon="check" />
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="battingNow = ''"
            v-if="battingNow"
          >
            <fa-icon icon="pen-to-square" />
          </button>
        </div>
      </div>
    </div>
    <div
      class="row mb-2 gy-2 justify-content-around"
      aria-details="Match functions"
    >
      <h3 class="col-12">Functions:</h3>
      <div aria-details="Add batter" class="col-auto">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#add-batter"
          :disabled="!battingNow"
        >
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Add batter"
          >
            <fa-icon icon="walking" />
            &nbsp;
            <fa-icon icon="plus" />
          </span>
        </button>
        <div
          class="modal fade"
          id="add-batter"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Choose batsman</h5>
                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row gy-2" v-if="battingNow == teams.t1">
                  <div
                    class="col-6 col-md-3 col-lg-2 d-grid"
                    v-for="(player, index) in players"
                    :key="index"
                  >
                    <button
                      type="button"
                      class="btn"
                      :class="[
                        batters.some((batter) => batter.name == player.t1p) ||
                        selectedBatter == player.t1p
                          ? 'btn-info'
                          : 'btn-outline-secondary',
                      ]"
                      :disabled="
                        batters.some((batter) => batter.name == player.t1p)
                      "
                      @click="selectBatter(player.t1p)"
                    >
                      {{ player.t1p }}
                    </button>
                  </div>
                </div>
                <div class="row gy-2" v-if="battingNow == teams.t2">
                  <div
                    class="col-6 col-md-3 col-lg-2 d-grid"
                    v-for="(player, index) in players"
                    :key="index"
                  >
                    <button
                      type="button"
                      class="btn"
                      :class="[
                        batters.some((batter) => batter.name == player.t2p) ||
                        selectedBatter == player.t2p
                          ? 'btn-info'
                          : 'btn-outline-secondary',
                      ]"
                      :disabled="
                        batters.some((batter) => batter.name == player.t2p)
                      "
                      @click="selectBatter(player.t2p)"
                    >
                      {{ player.t2p }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="setBatters"
                >
                  <fa-icon icon="circle-plus" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-details="Select bowler" class="col-auto">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#select-bowler"
          :disabled="!bowlingNow"
        >
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Select bowler"
          >
            <fa-icon icon="person-running" />
            &nbsp;
            <fa-icon icon="baseball-ball" />
          </span>
        </button>
        <div
          class="modal fade"
          id="select-bowler"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Choose bowler</h5>
                <button
                  type="button"
                  id="close-set-bowler"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row gy-2" v-if="battingNow == teams.t1">
                  <div
                    class="col-6 col-md-3 col-lg-2 d-grid"
                    v-for="(player, index) in players"
                    :key="index"
                  >
                    <button
                      type="button"
                      class="btn"
                      :class="[
                        selectedBowler == player.t2p
                          ? 'btn-info'
                          : 'btn-outline-secondary',
                      ]"
                      @click="selectBowler(player.t2p)"
                    >
                      {{ player.t2p }}
                    </button>
                  </div>
                </div>
                <div class="row gy-2" v-if="battingNow == teams.t2">
                  <div
                    class="col-6 col-md-3 col-lg-2 d-grid"
                    v-for="(player, index) in players"
                    :key="index"
                  >
                    <button
                      type="button"
                      class="btn"
                      :class="[
                        selectedBowler == player.t1p
                          ? 'btn-info'
                          : 'btn-outline-secondary',
                      ]"
                      @click="selectBowler(player.t1p)"
                    >
                      {{ player.t1p }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="setBowlers"
                >
                  <fa-icon icon="check" /> Select
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-details="Hit run" class="col-auto">
        <button
          type="button"
          class="btn btn-warning"
          data-bs-toggle="modal"
          data-bs-target="#add-score"
          :disabled="
            !selectedBatter ||
            !selectedBowler ||
            batters.filter((b) => !b.isOut && b.team == battingNow).length !=
              2 ||
            (bowlers
              .filter((s) => s.team != bowlingNow)
              .reduce((sum, item) => sum + item.balls, 0) %
              6 ==
              0 &&
              bowlers
                .filter((s) => s.team != bowlingNow)
                .reduce((sum, item) => sum + item.balls, 0) > 0)
          "
        >
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Add score"
          >
            <fa-icon icon="pen" />
            &nbsp;
            <fa-icon icon="clipboard-list" />
          </span>
        </button>
        <div
          class="modal fade"
          id="add-score"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabindex="-1"
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Choose a score from the following</h5>
                <button
                  type="button"
                  id="close-add-score"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                <div class="row g-2">
                  <div
                    class="col-auto d-grid"
                    v-for="(item, index) in availableScore"
                    :key="index"
                  >
                    <button
                      type="button"
                      class="btn btn-dark"
                      @click="addScore(item)"
                      :disabled="this.selectedScore.includes(item)"
                    >
                      {{ item.show }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-danger" @click="undoScore">
                  <fa-icon icon="rotate-left" /> Undo
                </button>
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="setScore"
                  :disabled="
                    batters.filter((b) => !b.isOut && b.team == battingNow)
                      .length != 2
                  "
                >
                  <fa-icon icon="plus" /> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-details="Undo previous" class="col-auto">
        <button type="button" class="btn btn-danger" @click="undoPrevScore">
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Undo last score entry"
          >
            <fa-icon icon="rotate-left" />
            &nbsp;
            <fa-icon icon="clipboard-list" />
          </span>
        </button>
      </div>
      <div aria-details="Switch batter" class="col-auto">
        <button
          type="button"
          class="btn btn-primary"
          @click="switchBatter"
          :disabled="
            batters.length < 1 ||
            batters.filter((b) => !b.isOut && b.team == battingNow).length != 2
          "
        >
          <span
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Switch batsman"
          >
            <fa-icon icon="toggle-on" />
            &nbsp;
            <fa-icon icon="walking" />
          </span>
        </button>
      </div>
    </div>
    <div class="mb-2" aria-details="Scorecard">
      <h3 class="my-2">Scorecard:</h3>
      <ul class="nav nav-tabs" role="tablist">
        <li
          class="nav-item col-6 col-md-auto"
          v-for="(team, teamN) in teams"
          :key="teamN"
        >
          <button
            type="button"
            role="tab"
            class="nav-link w-100"
            data-bs-toggle="tab"
            :data-bs-target="'#' + team + '_scorecard'"
          >
            {{ team }}
          </button>
        </li>
      </ul>
      <div class="tab-content">
        <div
          v-for="(team, teamN) in teams"
          :key="teamN"
          class="tab-pane fade py-3"
          :id="team + '_scorecard'"
        >
          <div class="row fw-bold">
            <div class="col-1">#</div>
            <div class="col-4">Batsman</div>
            <div class="col-2">Run</div>
            <div class="col-2">Balls</div>
            <div class="col-3">S/R</div>
          </div>
          <div
            class="row"
            v-for="(batter, index) in batters.filter((b) => b.team == team)"
            :key="index"
          >
            <div class="col-1">
              {{ index + 1 }}
            </div>
            <div class="col-4">
              {{ batter.name + (selectedBatter == batter.name ? " *" : "") }}
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
              {{
                scores
                  .filter((s) => s.team == team && !s.isRunByBatsman)
                  .reduce((sum, item) => sum + item.run, 0)
              }}
            </div>
            <div class="col-2">Runs</div>
            <div class="col-2">Overs</div>
            <div class="col-3">Run Rate</div>
            <div class="col-5">Total</div>
            <div class="col-2">
              {{ totalRun(team) }}
            </div>
            <div class="col-2">
              {{ totalOvers(team) }}
            </div>
            <div class="col-3">
              {{ runRate(team).toFixed(2) }}
            </div>
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
            v-for="(bowler, index) in bowlers.filter((b) => b.team != team)"
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
import availableHits from "./../router/availableHits";
import { Tooltip } from "bootstrap";
export default {
  mounted() {
    new Tooltip(document.body, {
      selector: "[data-bs-toggle='tooltip']",
    });
  },
  data() {
    return {
      step: 1,
      selectBatFirst: "",
      battingNow: "",
      batters: [],
      bowlers: [],
      teams: {
        t1: "",
        t2: "",
      },
      players: [],
      selectedBatter: "",
      selectedBowler: "",
      availableScore: availableHits,
      selectedScore: [],
      scores: [],
    };
  },
  computed: {
    bowlingNow() {
      if (this.battingNow) {
        return this.battingNow == this.teams.t1 ? this.teams.t2 : this.teams.t1;
      } else {
        return "";
      }
    },
  },
  methods: {
    setBatFirst() {
      if (!this.selectBatFirst) {
        toastr.error("Please select who is batting first.");
      } else {
        this.selectedBatter = "";
        this.selectedBowler = "";
        this.battingNow = this.selectBatFirst;
      }
    },
    selectBatter(player) {
      let batsmanInCrease = 0;
      this.batters.forEach((batter) => {
        if (!batter.isOut && batter.team == this.battingNow) {
          batsmanInCrease = batsmanInCrease + 1;
        }
      });
      if (batsmanInCrease < 2) {
        this.selectedBatter = player;
      } else {
        toastr.error("Two batsman already in crease.");
      }
    },
    selectBowler(player) {
      this.selectedBowler = player;
    },
    setBatters() {
      if (!this.batters.some((batter) => batter.name == this.selectedBatter)) {
        this.batters.push({
          name: this.selectedBatter,
          run: 0,
          balls: 0,
          isOut: false,
          team: this.battingNow,
        });
      }
    },
    setBowlers() {
      if (!this.bowlers.some((bowler) => bowler.name == this.selectedBowler)) {
        this.bowlers.push({
          name: this.selectedBowler,
          balls: 0,
          run: 0,
          wickets: 0,
          team: this.bowlingNow,
        });
      }
      document.getElementById("close-set-bowler").click();
    },
    addScore(item) {
      if (!this.selectedScore.includes(item)) {
        this.selectedScore.push(item);
      }
    },
    undoScore() {
      this.selectedScore.pop();
    },
    setScore() {
      this.checkForDots();
      const hits = this.selectedScore.map((s) => {
        return {
          ...s,
          runBy: this.selectedBatter,
          bowlBy: this.selectedBowler,
          team: this.battingNow,
        };
      });

      hits.forEach((hit) => {
        this.scores.push(hit);
      });
      this.addRunToBatter();
      this.addRunToBowler();
      this.checkSwitchBatsman();
      this.selectedScore = [];
      document.getElementById("close-add-score").click();
    },
    addRunToBatter() {
      this.batters = this.batters.map((batsman) => {
        return {
          ...batsman,
          run: 0,
          balls: 0,
          isOut: false,
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
              return { ...batsman, isOut: true };
            } else {
              return { ...batsman };
            }
          });
        }
      });
    },
    addRunToBowler() {
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
            if (bowler.name == r.bowlBy) {
              return { ...bowler, wickets: bowler.wickets + 1 };
            } else {
              return { ...bowler };
            }
          });
        }
      });
    },
    checkForDots() {
      if (
        this.selectedScore.some((score) => ["wd", "nb"].includes(score.show))
      ) {
        this.selectedScore = this.selectedScore.map((s) => {
          return { ...s, isBall: false };
        });
      }
    },
    checkSwitchBatsman() {
      if (
        this.selectedScore.some((score) =>
          ["1", "3", "5", "1b", "5b"].some((s) => s == score.show)
        ) ||
        this.bowlers.some(
          (bowler) => bowler.name == this.selectBowler && bowler.balls % 6 == 0
        )
      ) {
        this.switchBatter();
      }
    },
    switchBatter() {
      let nonStrike = this.batters
        .filter((s) => s.team == this.battingNow)
        .find((batter) => {
          return batter.name != this.selectedBatter && !batter.isOut;
        });
      this.selectedBatter = nonStrike.name;
    },
    undoPrevScore() {
      this.scores.pop();
      this.addRunToBatter();
      this.addRunToBowler();
    },
    totalRun(team) {
      return this.scores
        .filter((s) => s.team == team)
        .reduce((sum, item) => sum + item.run, 0);
    },
    totalOvers(team) {
      return (
        Math.floor(
          this.bowlers
            .filter((s) => s.team != team)
            .reduce((sum, item) => sum + item.balls, 0) / 6
        ) +
        "." +
        (this.bowlers
          .filter((s) => s.team != team)
          .reduce((sum, item) => sum + item.balls, 0) %
          6)
      );
    },
    runRate(team) {
      let balls = this.bowlers
        .filter((s) => s.team != team)
        .reduce((sum, item) => sum + item.balls, 0);
      return (this.totalRun(team) / balls) * 6;
    },
  },
  created() {
    this.teams = JSON.parse(sessionStorage.getItem("teams"));
    this.players = JSON.parse(sessionStorage.getItem("players"));
  },
};
</script>
