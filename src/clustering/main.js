let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(false), 17);

    document.getElementById('clustering_newPoints').addEventListener('click', function(){
        CH.reset();
    })
}, false);