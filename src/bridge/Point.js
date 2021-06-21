class Point extends Object{
    constructor(x, y, is_movable, m){
        super(x, y, is_movable);
        this.TYPE = "POINT"; 
        this.m = m;
    }

    update_pos(dt) {
        this.pos.x += this.v.x * dt + (0.5 * (this.F.x / this.m) * dt * dt);
        this.pos.y += this.v.y * dt + (0.5 * (this.F.y / this.m) * dt * dt);
    }

    update_vel(dt) {
        this.v.x += 0.5 * ((this.F.x + this.F_old.x) / this.m) * dt;
        this.v.y += 0.5 * ((this.F.y + this.F_old.y) / this.m) * dt;
    }

    apply_gravity(g) {
        this.F.y += this.m * g;
    }

    apply_dampening(l) {
        this.v.x *= l;
        this.v.y *= l;
    }

    draw(c){
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, 3, 0, 2 * Math.PI);
        c.fill();
    }
}
