let CH = null;
document.addEventListener('DOMContentLoaded', function () {
    CH = new CanvasHandler();
    setInterval(() => CH.update(), 300);

    document.getElementById('restartBloxorz').addEventListener('click', function () {
        CH.reset();
    })
}, false);

