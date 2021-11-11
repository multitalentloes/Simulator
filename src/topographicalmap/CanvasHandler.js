class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;

        this.cursor_radius = 100

        this.grid = this.initiate_grid(500, 500);

        this.c = document.getElementById("topographicalmap_canvas").getContext("2d");
    }

    // position of where the mouse it trying to raise the elevation
    update(increase_pos){
        if (increase_pos){
            this.grid.updateHeights(increase_pos, this.cursor_radius);
            let fromx = increase_pos.x - this.cursor_radius;
            let fromy = increase_pos.y - this.cursor_radius;
            let rad2 = this.cursor_radius*2;

            this.c.clearRect(fromx, fromy, rad2, rad2);
            this.grid.marchingSquares(fromx, fromy, fromx+rad2, fromy+rad2);
            this.grid.draw(this.c);
        }
    }

    initiate_grid(xpoints, ypoints){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        return new Grid(xpoints, ypoints, this.WIDTH, this.HEIGHT);
    }
}