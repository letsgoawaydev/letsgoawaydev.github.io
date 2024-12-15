window.addEventListener("touchstart", (ev) => {
    if (typeof( DeviceMotionEvent.requestPermission ) === "function") {
        DeviceMotionEvent.requestPermission()
        .then((response)=>{
            if (response == 'granted'){
                window.postMessage("yipeemotion");
            }
        });
    }
});