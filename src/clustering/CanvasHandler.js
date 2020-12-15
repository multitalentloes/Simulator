class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.NUM_OF_POINTS = 30;
        this.NUM_OF_CLUSTERS = 4;

        this.c = document.getElementById("canvas").getContext("2d");
        
        this.set = new SetOfPoints(this.NUM_OF_POINTS, this.NUM_OF_CLUSTERS, this.WIDTH, this.HEIGHT);
        this.next_frame = this.set.k_means_clustering();
    }

    update(){
        if (!this.next_frame.next().done){
            this.set.k_means_clustering();
            this.set.draw(this.c);
        }
    }

    reset(){
        this.set = new SetOfPoints(this.NUM_OF_POINTS, this.NUM_OF_CLUSTERS, this.WIDTH, this.HEIGHT);
        this.next_frame = this.set.k_means_clustering();
    }

    restart(){
        /* not in use
        this.points_set = new SetOfPoints(this.points_set.points);
        this.nextFrame = this.points_set.grahamScan();
        */
    }
}