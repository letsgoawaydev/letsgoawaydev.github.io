window.addEventListener("touchstart", (ev) => {
    if (!!DeviceMotionEvent.requestPermission) {
        DeviceMotionEvent.requestPermission();
    }
});