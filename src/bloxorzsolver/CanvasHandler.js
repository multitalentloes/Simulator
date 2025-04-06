class CanvasHandler {
    constructor() {
        this.WIDTH = 1920;
        this.HEIGHT = 1080;

        this.grid = new Grid(68);

        this.c = document.getElementById("canvas").getContext("2d");
    }

    update() {
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.grid.animation.next();
        this.grid.draw(this.c);
    }

    reset() {
    }

    generateKruskalLabyrinth() {
        this.grid.animation = this.grid.generateKruskalLabyrinth();
    }

    generateDFSLabyrinth() {
        this.grid.animation = this.grid.generateDFSLabyrinth();
    }

    BFS() {
        this.grid.animation = this.grid.BFS();
    }
    AStarMeetInTheMiddle() {
        this.grid.animation = this.grid.AStarMeetInTheMiddle();
    }
}
