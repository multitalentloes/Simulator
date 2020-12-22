class Point{
    constructor(x, y, draw_r, draw_color="#333333"){
        this.pos = {
            "x" : x,
            "y" : y
        }

        this.draw_radius = draw_r;
        this.draw_color = draw_color;
    }

    draw(c){
        c.strokeStyle=this.draw_color;
        c.lineWidth = 5;
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        c.fillStyle = "#AAAAAA";
        c.fill();
        c.stroke();
    }

    drawEdge(c, toNode){
        c.lineWidth = 5;
        c.strokeStyle = this.draw_color;
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