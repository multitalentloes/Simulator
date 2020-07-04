class Planet{
    constructor(x, y, is_movable, r, dx=0, dy=0){
        this.pos = {
            "x" : x,
            "y" : y
        }
        this.velocity = {
            "x" : dx,
            "y" : dy
        }
        this.acceleration = {
            "x" : 0,
            "y" : 0
        }
        this.is_movable = is_movable;
        this.radius = r;
    }

    draw(c){
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        c.stroke();
    }

    move(){
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        this.acceleration.x = 0;
        this.acceleration.y = 0;

        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }

    calculateGravity(obj){
        let unitVector = {
            "x" : this.DX(obj)/this.distance(obj),
            "y" : this.DY(obj)/this.distance(obj)
        }

        this.force = {
            "x" : unitVector.x *= Math.pow(10, 5)/Math.pow(this.distance(obj), 2),
            "y" : unitVector.y *= Math.pow(10, 5)/Math.pow(this.distance(obj), 2)
        }

        this.acceleration.x += this.force.x;
        this.acceleration.y += this.force.y;
    }

    distance(obj){
        let dx = this.DX(obj);
        let dy = this.DY(obj);
        return Math.sqrt(dx*dx+dy*dy);
    }

    DX(obj){
        return obj.pos.x - this.pos.x;
    }

    DY(obj){
        return obj.pos.y - this.pos.y;
    }
}