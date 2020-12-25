class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;

        this.c = document.getElementById("canvas").getContext("2d");

        this.source = new LightSource(900, 500, 15);
        this.polygons = this.createPolygons();
        this.showRays = true;

        this.update();
    }

    update(x=this.source.pos.x, y=this.source.pos.y){
        //update position of the light source
        this.source.moveTo(x, y);

        // cover the entire canvas with a blank rectangle
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        // draw objects
        for (let p of this.polygons){
            p.draw(this.c);
        }

        // adding shadow everywhere
        this.c.globalAlpha = 0.7;
        this.c.fillStyle = "#000000";
        this.c.fillRect(0, 0, this.WIDTH, this.HEIGHT);
        this.c.globalAlpha = 1;

        this.source.draw_light(this.c, this.polygons);

        // draw light source and shadows
        if(this.showRays) {
            this.source.draw_rays(this.c, this.polygons);
        }
        this.source.draw_source(this.c);
    }

    createPolygons(){
        let polygons = [];

        // adding outer edges of the environment
        polygons.push(new Polygon([new Point(0, 0), new Point(this.WIDTH, 0)]));
        polygons.push(new Polygon([new Point(this.WIDTH, 0), new Point(this.WIDTH, this.HEIGHT)]));
        polygons.push(new Polygon([new Point(this.WIDTH, this.HEIGHT), new Point(0, this.HEIGHT)]));
        polygons.push(new Polygon([new Point(0, this.HEIGHT), new Point(0, 0)]));

        // adding a rectangle
        polygons.push(new Polygon([new Point(240, 40), new Point(340, 40), new Point(340, 140), new Point(240, 140)]))

        // adding a triangle
        polygons.push(new Polygon([new Point(1240, 840), new Point(1640, 840), new Point(1440, 540)]))

        // adding a pentagon
        polygons.push(new Polygon([new Point(400, 800), new Point(500, 800), new Point(550, 700), new Point(450, 600), new Point(350, 700)]))


        return polygons;
    }

    flipRays(){
        this.showRays = !this.showRays;
        this.update();
    }
}