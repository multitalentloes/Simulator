let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(CH.update, 200);

    document.getElementById("newButton").addEventListener("click", function(){
        CH.reset();
    });

    document.getElementById("restartButton").addEventListener("click", function(){
        CH.restart();
    });
}, false);

