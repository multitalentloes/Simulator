class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.sufTree = null;
        this.c = document.getElementById("suffix_canvas").getContext("2d");
    }

    // position of where the mouse it trying to raise the elevation
    update_tree(str){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.sufTree = new SuffixTree(str);
        this.sufTree.draw(this.c, 0)
    }
}