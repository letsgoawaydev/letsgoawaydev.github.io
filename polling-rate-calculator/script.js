let mouseMovedTimes = 0;
let hzArray = [];
let hzMaximum = 0;
let hzModeMap = new Map();
let started = false;
window.addEventListener('mousemove', (ev) => {
    if (started) {
        mouseMovedTimes += 1;
    }
});

window.setInterval(() => {
    if (started) {
        document.getElementById("lastSecHZ").innerText = "Last sec: " + mouseMovedTimes + "hz";
        if (mouseMovedTimes != 0) {
            hzArray.push(mouseMovedTimes);
        }
        if (mouseMovedTimes >= hzMaximum) {
            hzMaximum = mouseMovedTimes;
            hzModeMap = new Map();
            document.getElementById("maxHZ").innerText = "Max: " + hzMaximum + "hz";
            let avg = 0;
            hzArray.forEach((v) => {
                avg += v;

                if (hzModeMap.has(v)) {
                    hzModeMap.set(v, hzModeMap.get(v) + 1);
                }
                else {
                    hzModeMap.set(v, 1);
                }
            });
            avg = avg / hzArray.length;
            document.getElementById("avgHZ").innerText = "Avg: " + avg + "hz";
            // Mode Calculation
            let lastVal = 0;
            let lastKey = 0;
            hzModeMap.forEach((val, key) => {
                if (val > lastVal) {
                    lastVal = val;
                    lastKey = key;
                } ''
            });
            document.getElementById("modeHZ").innerText = "Your Mouse's Polling Rate: " + lastKey + "hz";
        }
        mouseMovedTimes = 0;
    }
}, 1000);

function reset() {
    hzModeMap = new Map();

    mouseMovedTimes = 0;
    hzArray = [];
    hzMaximum = 0;
    document.getElementById("maxHZ").innerText = "Max: 0hz";
    document.getElementById("avgHZ").innerText = "Avg: 0hz";
    document.getElementById("lastSecHZ").innerText = "Last sec: 0hz";
    document.getElementById("modeHZ").innerText = "Your Mouse's Polling Rate: 0hz";


}
function toggle() {
    started = !started;
    if (started) {
        document.getElementById("toggleStateBut").innerText = "Stop";
        document.getElementById("notif").innerText = "Move your mouse in a circle on this window to calculate!";
    } else {
        document.getElementById("toggleStateBut").innerText = "Start";
        document.getElementById("notif").innerText = "";
    }
}
