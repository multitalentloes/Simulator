let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(), 200);

    document.getElementById("MST_newPoints").addEventListener("click", function(){
        CH.reset();
        CH.update();
    });
}, false);

