CH = new CanvasHandler();

var timestep = 1000 / 2000; 
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
		CH.update_all(timestep);

		delta -= timestep;
	}
	CH.draw_all();
	requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);
