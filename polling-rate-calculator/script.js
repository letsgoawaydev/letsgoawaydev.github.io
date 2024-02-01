let mouseMovedTimes = 0;
let hzArray = [];
let hzMaximum = 0;
let hzPollingRate = 0;
let hzAVG = 0;
let hzModeMap = new Map();
let started = false;
async function everySecond() {
    if (started) {
        document.getElementById("lastSecHZ").innerText = "Last sec: " + mouseMovedTimes + "hz";
        if (mouseMovedTimes != 0) {
            hzArray.push(mouseMovedTimes);
        }
        if (mouseMovedTimes >= hzMaximum) {
            hzMaximum = mouseMovedTimes;
        }
        hzModeMap = new Map();
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
        hzAVG = avg;
        // Mode Calculation
        let lastVal = 0;
        let lastKey = 0;
        hzModeMap.forEach((val, key) => {
            if (val > lastVal) {
                lastVal = val;
                lastKey = key;
            }
        });
        hzPollingRate = lastKey;
        mouseMovedTimes = 0;
    }
}
window.setInterval(() => {
    everySecond();
}, 1000);
window.addEventListener('pointerrawupdate', (ev) => {
    if (started) {
        const coalescedEvents = ev.getCoalescedEvents();
            for (let coalescedEvent of coalescedEvents) {
           mouseMovedTimes++;
        }
    }
});
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
function update() {
    document.getElementById("maxHZ").innerText = "Max: " + hzMaximum + "hz";
    document.getElementById("modeHZ").innerText = "Your Mouse's Polling Rate: " + hzPollingRate + "hz";
    document.getElementById("avgHZ").innerText = "Avg: " + hzAVG + "hz";
    requestAnimationFrame(update);
}
window.addEventListener("DOMContentLoaded", (ev) => {
    update();
})