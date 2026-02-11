<template>
    <div class="my-4 px-2">
        <h3>How to use:</h3>
        <ol class="px-4">
            <li>Open a new match.</li>
            <li>Enter team names and player names.</li>
            <li>Select which team is batting. </li>
            <li>
                Select batters.
                <span class="btn btn-primary btn-sm">
                    <fa-icon icon="walking" /> &nbsp;
                    <fa-icon icon="plus" />
                </span>
                <ul>
                    <li style="list-style: lower-alpha;">You can concurrenctly select 2 batters.</li>
                    <li style="list-style: lower-alpha;">Two batters must be selected to add scores.</li>
                </ul>
            </li>
            <li>
                Select bowler.
                <span class="btn btn-primary btn-sm">
                    <fa-icon icon="person-running" /> &nbsp;
                    <fa-icon icon="baseball-ball" />
                </span>
                <ul>
                    <li style="list-style: lower-alpha;">You must change bowler when it is an over.</li>
                    <li style="list-style: lower-alpha;">A bowler must be selected to add scores.</li>
                </ul>
            </li>
            <li>
                Add scores.
                <span class="btn btn-warning btn-sm">
                    <fa-icon icon="pen" /> &nbsp;
                    <fa-icon icon="clipboard-list" />
                </span>
                <ul>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">. </span> is for a dot
                    </li>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">b </span> is for bye-run
                    </li>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">wd</span> is for wide
                    </li>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">nb</span> is for no-ball
                    </li>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">w </span> is for wicket
                    </li>
                    <li style="list-style: lower-alpha;" class="mb-2">
                        <span class="btn btn-dark btn-sm">ro</span> is for run out
                        <span class="small text-gray"><br />
                            (You must switch batter accordingly and add cover-up score of that particular delivery.)
                        </span>
                    </li>
                </ul>
            </li>
            <li>You can switch batter anytime for any manual control.
                <span class="btn btn-primary btn-sm">
                    <fa-icon icon="toggle-on" /> &nbsp;
                    <fa-icon icon="walking" />
                </span>
            </li>
            <li>Click on the undo score button to undo the last score that was added.
                <span class="btn btn-danger btn-sm">
                    <fa-icon icon="rotate-left" /> &nbsp;
                    <fa-icon icon="clipboard-list" />
                </span>
            </li>
            <li>After an innings is complete, switch the innings by clicking on the button below the team name.
                <span class="btn btn-info btn-sm">
                    <fa-icon icon="toggle-on" />
                </span>
            </li>
            <li>When match is ended select the middle button to view match result and navigate to a new match.</li>
        </ol>
    </div>
</template>
<script>
export default {};
</script>