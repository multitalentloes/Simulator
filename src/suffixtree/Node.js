class Node{
    constructor(draw_color="#333333"){
        this.pos = {
            "x" : 0,
            "y" : 0
        }
        this.parent = -1;
        this.parent_edge = [-1, -1]; // stores where in the string the edge leading here is stored
        this.children = {}; // should be indexed by character that looks up idx of child
        this.suffix_link = -1; // idx of where the suffix link of this internal node points
        this.label_length = 0; // length of the string label of this node

        this.draw_radius = 20;
        this.draw_color = draw_color;
    }

    draw(c, idx){
        c.strokeStyle=this.draw_color;
        c.lineWidth = 5;
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        c.fillStyle = "#FFFFFF";
        c.fill();
        c.stroke();

        c.fillStyle = "#000000";
        c.font = "25px Arial";
        if (idx <= 9){
            c.fillText(idx, this.pos.x - 8, this.pos.y + 10);
        }
        else{
            c.fillText(idx, this.pos.x - 15, this.pos.y + 10);
        }
    }
}