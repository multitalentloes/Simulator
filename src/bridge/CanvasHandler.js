class CanvasHandler{
    constructor(){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.c = document.getElementById("canvas").getContext("2d");

        this.bridge = [];

        this.bridge_point_mass = 10;
        this.g = 0.001;
        this.k = 1;
        this.BRIDGE_POINTS = 100;

        let y = 200;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            this.bridge.push(new Point(i*this.WIDTH/(this.BRIDGE_POINTS - 1), y, is_in_middle, this.bridge_point_mass));
        }

        this.bridge_EQ = this.bridge[1].pos.x - this.bridge[0].pos.x;
    }

    update_bridge(dt) {
        this.bridge[0].update_pos(dt);

        for (let i = 1; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].update_pos(dt);

            this.bridge[i].reset_force();

            this.apply_bridge_forces(this.bridge[i-1], this.bridge[i]);

            this.bridge[i].apply_gravity(this.g)
            
            this.bridge[i-1].update_vel(dt);
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
