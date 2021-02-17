let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(), 25);

    this.getElementById("Kruskal").addEventListener("click", function(e){CH.generateKruskalLabyrinth();})
    this.getElementById("BFS").addEventListener("click", function(e){CH.BFS();})
}, false);
