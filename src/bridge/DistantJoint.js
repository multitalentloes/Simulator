class DistantJoint extends Object{
    constructor(x, y, is_movable, obj1, obj2, e){
        super(x, y, is_movable)
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.equilibrium = e-20; // the joint will not exert force if the objects are at this distance from eachother
        this.ex = e/2;
        this.ey = e/2;
        this.EQUILIBRIUM_CONSTANT = 12; 
        this.TYPE = "DISTANT_JOINT";
        this.pos = {
            "x" : (obj1.pos.x+obj2.pos.x)/2,
            "y" : (obj1.pos.y+obj2.pos.y)/2
        }
        this.v = {
            "x" : (obj1.v.x+obj2.v.x)/2,
            "y" : (obj1.v.y+obj2.v.y)/2
        }
        this.mass = (obj1.mass + obj2.mass)/2;



        this.calculateForces = this.calculateForces.bind(this);
    }

    calculateForces(){
        let unitVector = {
            "x" : this.DX()/Math.sqrt(this.distance()),
            "y" : this.DY()/Math.sqrt(this.distance())
        }

        let unitScaler = (Math.sqrt(this.distance()) - this.equilibrium)*this.EQUILIBRIUM_CONSTANT;

        let force = {
            "x" : unitVector.x*unitScaler,
            "y" : unitVector.y*unitScaler
        }
        this.obj1.force.x += force.x;
        this.obj1.force.y += force.y;
        this.obj2.force.x -= force.x;
        this.obj2.force.y -= force.y;
    }

    calculateAcceleration() {
        return 0;
    }

    calculateCollision(vx, vy) {
        this.obj1.v.x = vx/2;
        this.obj1.v.y = vy/2;
        this.obj2.v.x = vx/2;
        this.obj2.v.y = vy/2;
    }


    distance(){
        return this.DX() * this.DX() + this.DY() * this.DY(); // distance squared
    }

    DX(){
        return this.obj2.pos.x - this.obj1.pos.x;
    }
    
    DY(){
        return this.obj2.pos.y - this.obj1.pos.y;
    }

    draw(c){
        c.beginPath();
        c.moveTo(this.obj1.pos.x, this.obj1.pos.y);
        c.lineTo(this.obj2.pos.x, this.obj2.pos.y);
        c.stroke();
    }
}