class Point{
    constructor(x, y, draw_r=15, draw_color="#333333"){
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
}