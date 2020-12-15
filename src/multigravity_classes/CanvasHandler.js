class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.dragScaler = 1.0/25;

        this.c = document.getElementById("canvas").getContext("2d");

        //this.sun = new Planet(this.WIDTH/2, this.HEIGHT/2, false, 100, 0, 0, "#FFA500");
        this.bodies = []; // list av all the asteroids
        //this.bodies.push(new Planet(120, 250, true, 20, 5, -4));

        this.vectors = [] // list of all the vectors that will visualize the gravitational vector field
        const VEC_DIST = 40
        for(let i = 1; i*VEC_DIST - VEC_DIST/2< this.WIDTH; i++){
            for(let k = 1; k*VEC_DIST - VEC_DIST/2 < this.HEIGHT; k++){
                this.vectors.push(new Vector(i*VEC_DIST - VEC_DIST/2, k*VEC_DIST - VEC_DIST/2))
            }
        }
    }

    update(start, cur, end){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        for (let v of this.vectors){
            v.calcVector(this.bodies)
            v.draw(this.c);
        }

        if (start && cur){
            this.drawArrow(start.x, start.y, cur.x, cur.y);
        }

        if (start && end){
            let speedx = (end.x-start.x)*this.dragScaler;
            let speedy = (end.y-start.y)*this.dragScaler;
            this.bodies.push(new Planet(start.x, start.y, true, 20, speedx, speedy));
        }

        this.bodies = this.bodies.filter(p => {
            const r = p.radius;
            let is_too_far   = p.pos.x < 0 - r || p.pos.y < 0 - r || p.pos.x > this.WIDTH + r || p.pos.y > this.HEIGHT + r;
            return !is_too_far;
        }); // remove those that are too close

        for(let i = 0; i < this.bodies.length; i++){
            for(let k = i+1; k < this.bodies.length; k++){
                if (this.bodies[i].isOverlapping(this.bodies[k])){
                    this.bodies[i].merge(this.bodies[k]);
                    this.bodies.splice(k, 1);
                    k--;
                }
            }
        }

        for(let i = 0; i < this.bodies.length; i++){
            for(let k = 0; k < this.bodies.length; k++){
                if (!(i===k)){
                    this.bodies[i].calculateGravity(this.bodies[k]);
                }
            }
        }
        for(let p of this.bodies){
            p.move();
            p.draw(this.c);
        }
    }

    drawArrow(fromx, fromy, tox, toy){
        this.c.beginPath();
        this.c.moveTo(fromx, fromy);
        this.c.lineTo(tox, toy);
        
        let angle = Math.atan2(toy - fromy, tox - fromx);
        this.c.lineTo(tox - 15 * Math.cos(angle - Math.PI / 6), toy - 15 * Math.sin(angle - Math.PI / 6));
        this.c.moveTo(tox, toy);
        this.c.lineTo(tox - 15 * Math.cos(angle + Math.PI / 6), toy - 15 * Math.sin(angle + Math.PI / 6))
        this.c.stroke();
    }
}