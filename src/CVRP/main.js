let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(), 250);
    
    document.getElementById('newPoints').addEventListener('click', function(){
        CH.reset();
    })
}, false);


