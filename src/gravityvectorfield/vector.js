class Vector{
    constructor(x, y){
        this.pos = {
            "x" : x,
            "y" : y
        }
        this.dir = {
            "x" : 0,
            "y" : 0
        }

        this.curr_length = 0;
        this.LENGTH = 25;
    }

    calcVector(bodies){
        this.dir.x = 0;
        this.dir.y = 0;

        if (bodies.length == 0){
            this.dir.y = 1;
            return;
        }

        // here we calculate the direction of the vector
        for (let b of bodies){
            const dist = this.distanceSquared(b);
            const unit = this.unitVectorTo(b);
            const mass = Math.PI * b.radius * b.radius; // mass of the bodies are proportional to surface are in 2d
            this.dir.x += unit.x * mass / dist;
            this.dir.y += unit.y * mass / dist;
        }
        
        // now we need to scale the vector
        const length = this.vectorLength(this.dir);
        this.curr_length = length;
        this.dir.x /= length;
        this.dir.y /= length;
    }

    draw(c){
        // draws the vector as an arrow from this.pos to toCoordinate, with a length of this.LENGTH
        let toCoordinate = {
            "x" : this.pos.x + this.LENGTH*this.dir.x,
            "y" : this.pos.y + this.LENGTH*this.dir.y
        }

        c.strokeStyle = this.calculateOpacity(this.curr_length);

        c.beginPath();
        c.moveTo(this.pos.x, this.pos.y);
        c.lineTo(toCoordinate.x, toCoordinate.y);
        
        let angle = Math.atan2(toCoordinate.y - this.pos.y, toCoordinate.x - this.pos.x);
        c.lineTo(toCoordinate.x - 15 * Math.cos(angle - Math.PI / 6), toCoordinate.y - 15 * Math.sin(angle - Math.PI / 6));
        c.moveTo(toCoordinate.x, toCoordinate.y);
        c.lineTo(toCoordinate.x - 15 * Math.cos(angle + Math.PI / 6), toCoordinate.y - 15 * Math.sin(angle + Math.PI / 6))
        c.stroke();

        this.curr_length = 0;
    }

    distanceSquared(body){
        const xComp = Math.pow(body.pos.x - this.pos.x, 2)
        const yComp = Math.pow(body.pos.y - this.pos.y, 2)
        return xComp + yComp;
    }

    vectorLength(vec){
        const xComp = Math.pow(vec.x, 2)
        const yComp = Math.pow(vec.y, 2)
        return Math.sqrt(xComp + yComp);
    }

    unitVectorTo(body){
        let ans = {
            "x" : body.pos.x - this.pos.x,
            "y" : body.pos.y - this.pos.y
        }

        const length = this.vectorLength(ans);

        // divide by its own length to get the unit vector in the right direction
        ans.x /= length;
        ans.y /= length;

        return ans;
    }

    // map length to gray scale based on how much of max length we have
    calculateOpacity(length){
        let max_val = .05;
        length = Math.min(length, max_val);
        let rgb = (255 - Math.round((length / max_val)*255)).toString(16); 
        if (rgb.length < 2){
            rgb = "0" + rgb;
        }

        return "#" + rgb.repeat(3);
    }
}