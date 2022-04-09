class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.sufTree = new SuffixTree("bananaman");
        this.c = document.getElementById("suffix_canvas").getContext("2d");
    }

    // position of where the mouse it trying to raise the elevation
    update(){
        this.sufTree.draw(this.c, 0)
    }
}