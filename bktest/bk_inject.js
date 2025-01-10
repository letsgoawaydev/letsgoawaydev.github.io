HTMLCanvasElement.prototype.getContext = ((origFn) => {
    return function (type, attributes) {
        if (type == "webgl2") {
            return null;
        }

        attributes = Object.assign({}, attributes, {
            alpha:true,
            colorSpace: "display-p3",
            desynchronized: type != "2d",
            preserveDrawingBuffer: true,
            antialias: false,
            powerPreference: "high-performance",
            preferLowPowerToHighPerformance: false,
            xrCompatible:true,
        });
        return origFn.call(this, type, attributes);
    };
})(HTMLCanvasElement.prototype.getContext);