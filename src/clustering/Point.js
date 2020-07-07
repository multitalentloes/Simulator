class Point{
    constructor(x, y, draw_r, cluster, display_as_rect, draw_color="#333333"){
        this.pos = {
            "x" : x,
            "y" : y
        }
        
        this.display_as_rect = display_as_rect;
        this.cluster = cluster;
        this.draw_radius = draw_r;
        this.draw_color = draw_color;
    }

    draw(c){
        c.fillStyle = "#AAAAAA";
        c.strokeStyle=this.draw_color;
        c.lineWidth = 5;
        c.beginPath();
        
        if (this.display_as_rect){
            //console.log(this);
            c.rect(this.pos.x, this.pos.y, this.draw_radius*2, this.draw_radius*2);
        }
        else{
            c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        }
        c.fill();
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