const G = 9.81;

let CH = null;
document.addEventListener('DOMContentLoaded', function() { // når siden er lastet inn, kjør koden inne bracketen
    CH = new CanvasHandler();
    setInterval(CH.update, 17); //17 ish 60 fps
}, false);