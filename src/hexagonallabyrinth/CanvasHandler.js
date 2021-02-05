class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;

        this.grid = new Hexgrid(35);
    
        this.c = document.getElementById("canvas").getContext("2d");
    }

    update(){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.grid.draw(this.c);
    }

    reset(){
    }

    generateKruskalLabyrinth(){
        this.grid.generateKruskalLabyrinth();
    }

    BFS(){
        this.grid.BFS();
    }
}