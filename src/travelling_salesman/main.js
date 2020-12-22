let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(), 100);
}, false);

