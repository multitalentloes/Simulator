class Object{
    constructor(x, y, is_movable){
        this.pos = { // akksesser med this.pos["x"] eller this.pos.x
            "x" : x,
            "y" : y
        }
        this.v = {
            "x" : 0,
            "y" : 0
        }
        this.force = {
            "x" : 0,
            "y" : 0
        }
        this.acceleration = {
            "x" : 0,
            "y" : 0
        }
        this.is_movable = is_movable;

        this.move = this.move.bind(this);
        this.resetForces = this.resetForces.bind(this);
    }

    move(){
        if (this.is_movable){
            this.v.x += this.acceleration.x;
            this.v.y += this.acceleration.y;
            
            this.pos.x += this.v.x;
            this.pos.y += this.v.y;

            this.v.x *= 0.98;
            this.v.y *= 0.98;
        }
    }

    resetForces(){
        this.force.x = 0;
        this.force.y = 0;
    }
}