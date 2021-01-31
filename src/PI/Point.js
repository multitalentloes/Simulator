class Point{
    constructor(x, y, draw_r){
        this.x = x;
        this.y = y;

        this.draw_radius = draw_r;
        this.draw_color = this.getColor();
    }

    draw(c){
        c.strokeStyle="#000000";
        c.lineWidth = 2;
        c.fillStyle = this.draw_color;//this.draw_color;
        c.beginPath();
        c.arc(this.x, this.y, this.draw_radius, 0, 2 * Math.PI);
        c.fill();
        c.stroke();
    }

    isInside(){
        return Math.sqrt(this.x*this.x + this.y*this.y) <= 1080;
    }

    getColor(){
        // color red if inside the circle, blue otherwise
        let colorRed = this.isInside();
        if (colorRed){
            return "#EE0000";
        }
        else{
            return "#0000EE";
        }
    }
}