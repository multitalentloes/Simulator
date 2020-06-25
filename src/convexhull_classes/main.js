let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(false), 200);

    document.getElementById("newButton").addEventListener("click", function(){
        CH.reset();
        CH.update(true);
    });

    document.getElementById("restartButton").addEventListener("click", function(){
        CH.restart();
        CH.update(true);
    });

    document.getElementById("pauseButton").addEventListener("click", function(){
        CH.is_paused = !CH.is_paused;
        let button = document.getElementById("pauseButton");
        let old_text = button.innerHTML;
        button.innerHTML = (old_text == "Pause animation" ? "Start animation" : "Pause animation");
    });
}, false);

