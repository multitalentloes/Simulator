class CanvasHandler{
    constructor(){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.c = document.getElementById("canvas").getContext("2d");
        this.c.lineWidth=5;

        this.bridge_point_mass = 1;
        this.g = 0.00088;
        this.k = 0.20;
        this.l = 0.9999;
        this.BRIDGE_POINTS = 100;

        this.bridge = [];
        let y = 650;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            this.bridge.push(new Point(i*this.WIDTH/(this.BRIDGE_POINTS - 1), y, is_in_middle, this.bridge_point_mass));
        }
        this.bridge_EQ = this.bridge[1].pos.x - this.bridge[0].pos.x;


        this.circle_mass = 0.75;
        this.circles_n = 10;
        this.circles = [];

        for (let i = 0; i < this.circles_n; i++) {
            this.circles.push(new Circle (this.WIDTH /2- i, 0, true, 10, this.circle_mass))
        }
    }

    update_all(dt) {

        // pos and forces
        this.update_bridge_1(dt);
        this.update_circles_1(dt);
        this.circle_bridge_collision(dt);

        // vel-update
        this.update_bridge_2(dt);
        this.update_circles_2(dt);
    }

    draw_all() {
        this.draw_bridge();
        this.draw_circles();
    }

    circle_bridge_collision(dt) {
        for (let i = 0; i < this.circles_n; i++) {
            let C = this.circles[i]; 
            let r_squared = C.radius * C.radius;
            for (let j = 0; j < this.BRIDGE_POINTS - 1; j++) {
                let A = this.bridge[j];
                let B = this.bridge[j+1];

                let AB = {
                    "x" : B.pos.x - A.pos.x,
                    "y" : B.pos.y - A.pos.y
                }

                let AC = {
                    "x" : C.pos.x - A.pos.x,
                    "y" : C.pos.y - A.pos.y
                }

                let projection_factor = (AB.x * AC.x + AB.y * AC.y) / (AC.x * AC.x + AC.y * AC.y);

                let AD = {
                    "x" : projection_factor * AC.x,
                    "y" : projection_factor * AC.y
                }
                
                let CD = {
                    "x" : AD.x - AC.x,
                    "y" : AD.y - AC.y
                }

                if (CD.x * CD.x + CD.y * CD.y <= r_squared) {
                    let D = {
                        "x" : (A.pos.x + B.pos.x) / 2,
                        "y" : (A.pos.y + B.pos.y) / 2,
                        "vx" : (A.v.x + B.v.x) / 2,
                        "vy" : (A.v.y + B.v.y) / 2,
                        "m" : (A.m + B.m) / 2
                    }
                    // 1 : D
                    // 2 : C
                    let k = 2 * C.m / (D.m + C.m);
                    let ip = (D.vx - C.v.x) * (D.x - C.pos.x) + (D.vy - C.v.y) * (D.y - C.pos.y);
                    let k2 = 2 * D.m / (D.m + C.m);
                    let ip2 = (C.v.x - D.vx) * (C.pos.x - D.x) + (C.v.y - D.vy) * (C.pos.y - D.y);
                    let c = Math.pow(D.x - C.pos.x, 2) + Math.pow(D.y - C.pos.y, 2);
                    let new_D = {
                        "vx" : D.vx - k * ip * (D.x - C.pos.x) / c,
                        "vy" : D.vy - k * ip * (D.y - C.pos.y) / c
                    }

                    let new_C = {
                        "vx" : C.v.x - k2 * ip2 * (C.pos.x - D.x) / c,
                        "vy" : C.v.y - k2 * ip2 * (C.pos.y - D.y) / c,
                    }

                    let C_dp = {
                        "x" : new_C.vx - C.v.x,
                        "y" : new_C.vy - C.v.y
                    }

                    let D_dp = {
                        "x" : new_D.vx - D.vx,
                        "y" : new_D.vy - D.vy
                    }
                    C.F.x += C_dp.x / dt;
                    C.F.y += C_dp.y / dt;

                    if (j != 0) { 
                        A.F.x += D_dp.x / (dt*2);
                        A.F.y += D_dp.x / (dt*2);
                    }

                    if (j + 1 != this.BRIDGE_POINTS - 1) {
                        B.F.x += D_dp.x / (dt*2);
                        B.F.y += D_dp.y / (dt*2);
                    }
                }
            }
        }

        /*

        for (let i = 0; i < this.circles_n; i++) {
            if (this.circles[i].pos.x >= this.WIDTH) {
                this.circles[i].v.x *= -1;
            }
            if (this.circles[i].pos.x <= 0) {
                this.circles[i].v.x *= -1;
            }
        }
        */
    }


    update_circles_1(dt) {
        for (let i = 0; i < this.circles_n; i++) {
            this.circles[i].update_pos(dt);
            this.circles[i].reset_force();
            this.circles[i].apply_gravity(this.g);
        }
    }

    update_circles_2(dt) {
        for (let i = 0; i < this.circles_n; i++) {
            this.circles[i].update_vel(dt);
        }
    }

    draw_circles() {
        for (let i = 0; i < this.circles_n; i++) {
            this.circles[i].draw(this.c);
        }
    }

    update_bridge_2(dt) {
        for (let i = 0; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].update_vel(dt);
            this.bridge[i].apply_dampening(this.l);
        }
    }

    //bridge:
    update_bridge_1(dt) {
        this.bridge[0].update_pos(dt);

        for (let i = 1; i < this.BRIDGE_POINTS; i++) {
            this.bridge[i].update_pos(dt);
            this.bridge[i].reset_force();
            this.apply_bridge_forces(this.bridge[i-1], this.bridge[i]);
            this.bridge[i].apply_gravity(this.g)
        }
        this.bridge[this.BRIDGE_POINTS - 1].reset_force();
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
