class Node{
    constructor(x, y, draw_color="#333333"){
        this.pos = {
            "x" : x,
            "y" : y
        }
        this.parent = -1;
        this.parent_edge = [-1, -1]; // stores where in the string the edge leading here is stored
        this.children = {}; // should be indexed by character that looks up idx of child
        this.suffix_link = -1; // idx of where the suffix link of this internal node points
        this.label_length = 0; // length of the string label of this node

        this.draw_radius = 15;
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