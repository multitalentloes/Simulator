class Object{
    constructor(x, y, is_movable){
        this.pos = { // akksesser med this.pos["x"] eller this.pos.x
            "x" : x,
            "y" : y
        }
        this.delta = {
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
        this.energy_loss = 1.00;

        this.move = this.move.bind(this);
        this.resetForces = this.resetForces.bind(this);
    }

    move(){
        //this.energy_loss *= 0.999;
        if (this.is_movable){
            this.delta.x += this.energy_loss*this.acceleration.x;
            this.delta.y += this.energy_loss*this.acceleration.y;
            
            this.pos.x += this.energy_loss*this.delta.x;
            this.pos.y += this.energy_loss*this.delta.y;
        }
    }

    resetForces(){
        this.force.x = 0;
        this.force.y = 0;
    }
}