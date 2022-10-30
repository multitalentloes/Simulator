class CanvasHandler{
    constructor(gridw, gridh){
        this.grid = new Grid(gridw, gridh);

        this.c = document.getElementById("waveequationcanvas").getContext("2d");
    }

    update(cursor){
        if (cursor){
            this.grid.set_to_one(cursor.x, cursor.y);
        }
        this.grid.iterate();
        this.grid.display(this.c);
    }
}