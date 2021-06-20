CH = new CanvasHandler();

var timestep = 1000 / 500; 
var lastFrameTimeMs = 0; 
var delta = 0;
var maxFPS = 60;

function mainLoop(timestamp) {
	if (timestamp < lastFrameTimeMs + (1000 / maxFPS)) {
        requestAnimationFrame(mainLoop);
        return;
    }

	delta += timestamp - lastFrameTimeMs;
	lastFrameTimeMs = timestamp;

	while (delta >= timestep) {
		CH.update_bridge(timestep);

		delta -= timestep;
	}
	CH.draw_bridge();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
