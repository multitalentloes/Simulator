class CanvasHandler{
    constructor(){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.c = document.getElementById("canvas").getContext("2d");

        this.bridge = [];

        this.bridge_point_mass = 1000;
        this.g = 1;
        this.k = 20;
        this.BRIDGE_POINTS = 100;

        let y = 200;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            this.bridge.push(new Point(i*this.WIDTH/(this.BRIDGE_POINTS - 1), y, is_in_middle, this.bridge_point_mass));
        }

        this.bridge_EQ = this.bridge[1].pos.x - this.bridge[0].pos.x;
    }

    update_bridge(dt) {
        this.update_all_bridge_pos(dt);

        this.update_bridge_oscillator_forces();

        this.update_bridge_gravity();

        this.update_all_bridge_vel(dt);
    }

    draw_bridge() {
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.c.beginPath();
        this.c.moveTo(this.bridge[0].pos.x, this.bridge[0].pos.y);
        for (let i = 1; i < this.BRIDGE_POINTS; i++) {
            this.c.lineTo(this.bridge[i].pos.x, this.bridge[i].pos.y);
        }
        this.c.stroke();

        /*for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].draw(this.c);
        }*/
    }

    update_all_bridge_pos(dt) {
        for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            if (this.bridge[i].is_movable) {
                this.bridge[i].update_pos(dt);
                this.bridge[i].F_old = this.bridge[i].F;
                this.bridge[i].F.x = 0;
                this.bridge[i].F.y = 0;
            }
        }
    }

    update_bridge_oscillator_forces() {
        for (let i = 0; i < this.BRIDGE_POINTS - 1; i++) {
            let point1 = this.bridge[i];
            let point2 = this.bridge[i+1];
        
            let dx = point2.pos.x - point1.pos.x;
            let dy = point2.pos.y - point1.pos.y;

            let dist = Math.sqrt(dx*dx + dy*dy); 

            // unit vector
            let vector = {
                "x" : dx / dist,
                "y" : dy / dist,
            }

            // force vector
            let force = {
                "x" : vector.x * (dist - this.bridge_EQ) * this.k,
                "y" : vector.y * (dist - this.bridge_EQ) * this.k

            }

            // update forces
            if (point1.is_movable) {
                point1.F.x += force.x;
                point1.F.y += force.y;
            }

            if (point2.is_movable) {
                point2.F.x -= force.x;
                point2.F.y -= force.y;
            }
        }
    }

    update_bridge_gravity() {
        for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            if (this.bridge[i].is_movable) {
                this.bridge[i].F.y += this.g; 
            }
        }
    }

    update_all_bridge_vel(dt) {
        for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            if (this.bridge[i].is_movable) {
                this.bridge[i].update_vel(dt);
            }
        }
    }
}
