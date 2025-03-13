let CH = null;
document.addEventListener('DOMContentLoaded', function () {
    CH = new CanvasHandler();
    setInterval(() => CH.update(false), 50);

    document.getElementById("convexhull_newButton").addEventListener("click", function () {
        CH.reset();
        CH.update(true);
    });

    document.getElementById("convexhull_restartButton").addEventListener("click", function () {
        CH.restart();
        CH.update(true);
    });
}, false);

