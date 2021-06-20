class Point{
    constructor(x, y, draw_r, shape="circle", draw_color="#333333"){
        this.pos = {
            "x" : x,
            "y" : y
        }

        this.shape = shape;
        this.draw_radius = draw_r;
        this.draw_color = draw_color;
    }

    draw(c){
        c.strokeStyle=this.draw_color;
        c.lineWidth = 5;
        c.beginPath();
        if (this.shape == "circle"){
            c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        }
        if (this.shape == "square"){
            c.rect(this.pos.x - this.draw_radius/2, this.pos.y - this.draw_radius/2, this.draw_radius, this.draw_radius);
        }
        c.fillStyle = "#AAAAAA";
        c.fill();
        c.stroke();
    }

    drawEdge(c, toNode, color){
        c.lineWidth = 5;
        c.strokeStyle = color;
        c.beginPath();
        c.moveTo(this.pos.x, this.pos.y);
        c.lineTo(toNode.pos.x, toNode.pos.y);
        c.stroke();
    }

    dist(p2){
        let DX = this.pos.x-p2.pos.x;
        let DY = this.pos.y-p2.pos.y;
        return Math.sqrt(DX*DX + DY*DY);
    }

    equals(b){
        return this.pos.x == b.pos.x && this.pos.y == b.pos.y;
    }
}