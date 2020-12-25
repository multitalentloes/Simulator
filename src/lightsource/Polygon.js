class Polygon{
    constructor(points, line_width=10, draw_color="#333333", fill_color="#000000"){
        this.vertices = points

        this.line_width = line_width;
        this.draw_color = draw_color;
        this.fill_color = fill_color;
    }

    draw(c){
        c.lineWidth = this.line_width;
        c.strokeStyle = this.draw_color;
        c.fillStyle = this.fill_color;

        c.beginPath();
        c.moveTo(this.vertices[0].pos.x, this.vertices[0].pos.y);
        for(let i = 1; i < this.vertices.length; i++){
            let nextPoint = this.vertices[i];
            c.lineTo(nextPoint.pos.x, nextPoint.pos.y);
        }
        c.closePath();
        c.fill();
    }
}