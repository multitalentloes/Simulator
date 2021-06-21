class CanvasHandler{
    constructor(){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.c = document.getElementById("canvas").getContext("2d");

        this.bridge_point_mass = 1;
        this.g = 0.00088;
        this.k = 0.1;
        this.l = 0.999;
        this.BRIDGE_POINTS = 100;

        this.bridge = [];
        let y = 200;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            this.bridge.push(new Point(i*this.WIDTH/(this.BRIDGE_POINTS - 1), y, is_in_middle, this.bridge_point_mass));
        }
        this.bridge_EQ = this.bridge[1].pos.x - this.bridge[0].pos.x;


        this.circle_mass = 1;
        this.circles_n = 1;
        this.circles = [];
        this.circles.push(new Circle (this.WIDTH/2, 5, true, 50, this.circle_mass))
    }

    update_all(dt) {
        this.update_bridge(dt);
        this.update_circles(dt);
        this.circle_bridge_collision();
    }

    draw_all() {
        this.draw_bridge();
        this.draw_circles();
    }

    circle_bridge_collision() {
        for (let i = 0; i < this.circles_n; i++) {
            let C = this.circles[i]; 
            let r_squared = C.radius * C.radius;
            for (let j = 0; j < this.BRIDGE_POINTS - 1; j++) {
                let A = this.bridge[j];
                let B = this.bridge[j+1];

                if ((C.pos.x - C.radius <= A.pos.x) && (C.pos.x + C.radius >= B.pos.x)) {
                    let a = Math.pow((B.pos.x - A.pos.x) * (A.pos.y - C.pos.y) - (A.pos.x - C.pos.x) * (B.pos.y - A.pos.y), 2);
                    let b = Math.pow(B.pos.x - A.pos.x, 2) + Math.pow(B.pos.y - A.pos.y, 2);
                    let dist_squared = a / b;

                    if (dist_squared <= r_squared) {
                        C.v.y *= -1; // eksempel 
                    }
                }
            }
        }
    }

    update_circles(dt) {
        for (let i = 0; i < this.circles_n; i++) {
            this.circles[i].update_pos(dt);
            this.circles[i].reset_force();
            this.circles[i].apply_gravity(this.g);
            this.circles[i].update_vel(dt);
            this.circles[i].apply_dampening(this.l);
        }
    }

    draw_circles() {
        for (let i = 0; i < this.circles_n; i++) {
            this.circles[i].draw(this.c);
        }
    }

    //bridge:
    update_bridge(dt) {
        this.bridge[0].update_pos(dt);

        for (let i = 1; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].update_pos(dt);
            this.bridge[i].reset_force();
            this.apply_bridge_forces(this.bridge[i-1], this.bridge[i]);
            this.bridge[i].apply_gravity(this.g)
            this.bridge[i-1].update_vel(dt);
            this.bridge[i-1].apply_dampening(this.l);
        }

        this.bridge[this.BRIDGE_POINTS - 1].reset_force();
        this.apply_bridge_forces(this.bridge[this.BRIDGE_POINTS - 2], this.bridge[this.BRIDGE_POINTS - 1]);
        this.bridge[this.BRIDGE_POINTS - 1].update_vel(dt);
    }

    apply_bridge_forces(p1, p2) {    
        let dx = p2.pos.x - p1.pos.x;
        let dy = p2.pos.y - p1.pos.y;
        let dist = Math.sqrt(dx*dx + dy*dy); 

        let force = {
            "x" : (dx / dist) * (dist - this.bridge_EQ) * this.k,
            "y" : (dy / dist) * (dist - this.bridge_EQ) * this.k
        }

        // update forces
        if (p1.is_movable) {
            p1.F.x += force.x;
            p1.F.y += force.y;
        }

        if (p2.is_movable) {
            p2.F.x -= force.x;
            p2.F.y -= force.y;
        }
    }

    draw_bridge() {
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.c.beginPath();
        this.c.moveTo(this.bridge[0].pos.x, this.bridge[0].pos.y);
        for (let i = 1; i < this.BRIDGE_POINTS; i++) {
            this.c.lineTo(this.bridge[i].pos.x, this.bridge[i].pos.y);
        }
        this.c.stroke();

        /*
        for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].draw(this.c);
        }
        */
        
    }
}
