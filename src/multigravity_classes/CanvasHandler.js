class CanvasHandler{
    constructor(){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        this.dragScaler = 1.0/25;

        this.c = document.getElementById("canvas").getContext("2d");

        //this.sun = new Planet(this.WIDTH/2, this.HEIGHT/2, false, 100, 0, 0, "#FFA500");
        this.bodies = [];
        //this.bodies.push(new Planet(120, 250, true, 20, 5, -4));

    }

    update(start, cur, end){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        if (start && cur){
            this.c.beginPath();
            this.c.moveTo(start.x, start.y);
            this.c.lineTo(cur.x, cur.y);
            
            let angle = Math.atan2(cur.y - start.y, cur.x - start.x);
            this.c.lineTo(cur.x - 15 * Math.cos(angle - Math.PI / 6), cur.y - 15 * Math.sin(angle - Math.PI / 6));
            this.c.moveTo(cur.x, cur.y);
            this.c.lineTo(cur.x - 15 * Math.cos(angle + Math.PI / 6), cur.y - 15 * Math.sin(angle + Math.PI / 6))
            this.c.stroke();
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
}