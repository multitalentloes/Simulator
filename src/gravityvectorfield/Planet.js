
class Planet{
    constructor(x, y, is_movable, r, dx=0, dy=0, color="#AAAAAA"){
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
        this.color = color;
    }

    draw(c){
        c.fillStyle = this.color;
        c.strokeStyle = "#000000";
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        c.fill();
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
        
        let forceScaler = this.area(this.radius)*this.area(obj.radius)/100;

        this.force = {
            "x" : unitVector.x *= forceScaler/(50000+Math.pow(this.distance(obj), 2)),
            "y" : unitVector.y *= forceScaler/(50000+Math.pow(this.distance(obj), 2))
        }
        
        const G = 1000; // gravitational constant to see iteresting results

        this.acceleration.x += G*this.force.x/this.area(this.radius);
        this.acceleration.y += G*this.force.y/this.area(this.radius);
    }

    merge(obj){
        const ratio = this.area(this.radius)/(this.area(this.radius)+this.area(obj.radius)) // how much of the area of the sums is from this planet
        this.radius = Math.sqrt(Math.pow(this.radius, 2) + Math.pow(obj.radius, 2));
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
        this.velocity.x += obj.velocity.x*(1-ratio);
        this.velocity.y += obj.velocity.y*(1-ratio);
    }

    area(r){
        return Math.PI*r*r;
    }

    isOverlapping(obj){
        return this.radius + obj.radius > this.distance(obj);
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