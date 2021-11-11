class Point{
    constructor(x, y, draw_r, value, draw_color="#333333"){
        this.pos = {
            "x" : x,
            "y" : y
        }

        this.value = value;
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

    dist(p2){
        let DX = this.pos.x-p2.pos.x;
        let DY = this.pos.y-p2.pos.y;
        return Math.sqrt(DX*DX + DY*DY);
    }

    cursor_dist(pos){
        let DX = this.pos.x-pos.x;
        let DY = this.pos.y-pos.y;
        return Math.sqrt(DX*DX + DY*DY);
    }

    equals(b){
        return this.pos.x == b.pos.x && this.pos.y == b.pos.y;
    }
}