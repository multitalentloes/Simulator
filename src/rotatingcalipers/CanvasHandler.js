class CanvasHandler {
    constructor() {
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.NUM_OF_POINTS = 20;
        // this.NUM_OF_POINTS = 5;

        this.c = document.getElementById("convexhull_canvas").getContext("2d");

        this.points_set = new SetOfPoints(this.generatePoints(this.NUM_OF_POINTS));
        // this.points_set = new SetOfPoints([
        //     new Point(200 + 300 * -0.2, 200 + 300 * -0.2, 15),
        //     new Point(200 + 300 * 0.2, 200 + 300 * -0.1, 15),
        //     new Point(200 + 300 * 0.0, 200 + 300 * 0.1, 15),
        //     new Point(200 + 300 * 0.5, 200 + 300 * 0.2, 15),
        //     new Point(200 + 300 * 0.1, 200 + 300 * 0.1, 15)
        // ]);
        // this.points_set = new SetOfPoints([
        //     new Point(-0.2, -0.2, 15),
        //     new Point(0.2, -0.1, 15),
        //     new Point(0.0, 0.1, 15),
        //     new Point(0.5, 0.2, 15),
        //     new Point(0.1, 0.1, 15)
        // ]);
        // this.nextFrame = this.points_set.grahamScan();
        this.is_paused = false;

        this.line = new Line(this.points_set.points[0], this.points_set.points[1], "#000000");
        this.update = this.update.bind(this);
        this.generatePoints = this.generatePoints.bind(this);
    }

    update(force_render) {
        // if ((!this.nextFrame.next().done && !this.is_paused) || force_render) {
        //     this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        //     this.points_set.draw(this.c);
        // }
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        this.points_set.draw(this.c);
    }

    reset() {
        this.points_set = new SetOfPoints(this.generatePoints(this.NUM_OF_POINTS));
        // this.nextFrame = this.points_set.grahamScan();
    }

    restart() {
        this.points_set = new SetOfPoints(this.points_set.points);
        // this.nextFrame = this.points_set.grahamScan();
    }

    generatePoints(n) { // generate n points randomely distributed in the canvas, but dont place them to close to another
        let res = [];
        for (let i = 0; i < n; i++) {
            let p;
            do {
                let x = Math.floor(Math.random() * (this.WIDTH - 900) + 450);
                let y = Math.floor(Math.random() * (this.HEIGHT - 500) + 250);
                p = new Point(x, y, 15);
            } while (res.some((e) => p.dist(e) <= 40)); //generate new point unless not all points are far enough away 

            res.push(p);
        }
        return res;
    }
}
