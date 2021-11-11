class Line{
    constructor(p1, p2, color="#000000"){
        this.p1 = p1; // point object
        this.p2 = p2; // point object
        this.color = color; // hex RGB string
    }

    draw(c){
        c.lineWidth = 5;
        c.strokeStyle = this.color;
        c.beginPath();
        c.moveTo(this.p1.pos.x, this.p1.pos.y);
        c.lineTo(this.p2.pos.x, this.p2.pos.y);
        c.stroke();
    }

    equals(l2){ // this line is equivalent to line2 if they have same start and end point
        return this.p1.equals(l2.p1) && this.p2.equals(l2.p2);
    }
}