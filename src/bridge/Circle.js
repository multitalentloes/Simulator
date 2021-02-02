class Circle extends Object{
    constructor(x, y, is_movable, r, MASS_CONSTANT){
        super(x, y, is_movable);
        this.radius = r;
        this.mass = Math.PI*r*r*MASS_CONSTANT;
        this.DAMPING = 0.99;    
        this.TYPE = "CIRCLE"; 

        this.calculateForces = this.calculateForces.bind(this);
    }

    calculateForces(){
        this.force.y += G; // gravitasjonskraft
    }

    calculateAcceleration() {
        this.acceleration.x = (this.force.x / this.mass);
        this.acceleration.y = (this.force.y / this.mass);
    }

    calculateCollision(vx, vy) {
        this.v.x = vx;
        this.v.y = vy;
    }

    draw(c){
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        c.stroke();
    }
}