class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.NUM_OF_POINTS = 30;

        this.c = document.getElementById("canvas").getContext("2d");
        
        this.points_set = new SetOfPoints(this.generatePoints(this.NUM_OF_POINTS));
        this.nextFrame = this.points_set.grahamScan();

        this.line = new Line(this.points_set.points[0], this.points_set.points[1], "#000000");
        this.update = this.update.bind(this);
        this.generatePoints = this.generatePoints.bind(this);
    }

    update(){
        if (!this.nextFrame.next().done){
            this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
            this.points_set.draw(this.c);
        }
    }

    reset(){
        this.points_set = new SetOfPoints(this.generatePoints(this.NUM_OF_POINTS));
        this.nextFrame = this.points_set.grahamScan();
    }

    restart(){
        this.points_set = new SetOfPoints(this.points_set.points);
        this.nextFrame = this.points_set.grahamScan();
    }

    generatePoints(n){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        let res = [];
        for(let i = 0; i < n; i++){
            let p;
            do {
                let x = Math.floor(Math.random()*(this.WIDTH-100) + 50);
                let y = Math.floor(Math.random()*(this.HEIGHT-100) + 50);
                p = new Point(x, y, 15);
            } while (res.some((e) => p.dist(e) <= 40)); //generate new point unless not all points are far enough away 

            res.push(p);
        }
        return res;
    }
}