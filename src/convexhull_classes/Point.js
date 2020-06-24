class Point{
    constructor(x, y, draw_r, draw_color="#000000"){
        this.pos = {
            "x" : x,
            "y" : y
        }

        this.draw_radius = draw_r;
        this.draw_color = draw_color;
    }

    draw(c){
        c.strokeStyle=this.draw_color;
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        c.stroke();
    }

    dist(p2){
        let DX = this.pos.x-p2.pos.x;
        let DY = this.pos.y-p2.pos.y;
        return Math.sqrt(DX*DX + DY*DY);
    }
}