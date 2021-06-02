class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.NUM_OF_TRIPS = 2;
        this.TRIP_SIZE = 6;

        this.c = document.getElementById("canvas").getContext("2d");
        
        this.points_set = new SetsOfPoints(this.NUM_OF_TRIPS, this.TRIP_SIZE, this.HEIGHT, this.WIDTH);

        this.update = this.update.bind(this);
        this.generatePoints = this.generatePoints.bind(this);
    }

    reset(){
        this.points_set = new SetsOfPoints(this.NUM_OF_TRIPS, this.TRIP_SIZE, this.HEIGHT, this.WIDTH);
    }

    update(){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.points_set.draw(this.c);
        this.points_set.climb();
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