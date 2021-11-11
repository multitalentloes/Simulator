class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;

        this.cursor_radius = 100

        this.grid = this.initiate_grid(400, 400);

        this.c = document.getElementById("topographicalmap_canvas").getContext("2d");
    }

    // position of where the mouse it trying to raise the elevation
    update(increase_pos){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        if (increase_pos){
            this.grid.updateHeights(increase_pos, this.cursor_radius);
        }
        this.grid.marchingSquares();
        this.grid.draw(this.c);
    }

    initiate_grid(xpoints, ypoints){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        return new Grid(xpoints, ypoints, this.WIDTH, this.HEIGHT);
    }
}