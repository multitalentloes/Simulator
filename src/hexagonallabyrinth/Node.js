const HEX_GRAY = "#DDDDDD";
const HEX_BLACK = "#000000";
const HEX_LIGHT_BLUE = "#b5b5ff";
const HEX_DARK_BLACK = "#5959ff";
const HEX_GREEN = "#6eb86e";
const HEX_RED = "#ba5252";
const HEX_YELLOW = "#9c9210";

class Node{
    constructor(radius, x, y){
        this.radius = radius; // radius of a single hexagon
        this.pos = {
            "x" : x,
            "y" : y
        }

        this.corners = this.getCornerVectors(radius);

        // possible states: {DEFAULT, IN_QUEUE, VISITED, IN_PATH, START, END}
        this.state = "DEFAULT"
        this.state_to_color = this.getStateConverter();

        // an edge begin true means that we can traverse that edge
        // the first edge is the one facing north-east
        this.edges = [false, false, false, false, false, false];
        this.visited = false;
    }

    draw(c){
        //fill in hexagon
        c.strokeStyle = HEX_GRAY; 
        c.fillStyle = this.state_to_color[this.state];
        c.beginPath();
        c.moveTo(this.pos.x + this.corners[0].x, this.pos.y + this.corners[0].y);
        for (let i = 1; i < 6; i++){
            c.lineTo(this.pos.x + this.corners[i].x, this.pos.y + this.corners[i].y)
        }
        c.closePath();
        c.fill();
        c.stroke();

        //draw edges based on whether they can be traversed
        c.strokeStyle = HEX_BLACK; 
        for(let i = 0; i < 6; i++){
            if (!this.edges[i]){ // if the edge is not traversable, that is when we draw the blocking edge of the hexago
                c.lineWidth = 2;
                c.beginPath();
                c.moveTo(this.pos.x + this.corners[i].x, this.pos.y + this.corners[i].y);
                c.lineTo(this.pos.x + this.corners[(i+1)%6].x, this.pos.y + this.corners[(i+1)%6].y);
                c.stroke();
            }
        }
    }

    getCornerVectors(radius){
        /*
            In a regular hexagon of sidelength one, the corners can be place in (starting at 0 radians and going against the clock)
            (1, 0)
            (1/2, sqrt(3)/2)
            (-1/2, sqrt(3)/2)
            (-1, 0)
            (-1/2, -sqrt(3)/2)
            (1/2, -sqrt(3)/2)
        */

        return [ // unit vectors pointing to the corners.
            { "x" : radius*1,    "y" : radius*0         },
            { "x" : radius*1/2,  "y" : radius*Math.sqrt(3)/2 },
            { "x" : radius*-1/2, "y" : radius*Math.sqrt(3)/2 },
            { "x" : radius*-1,   "y" : radius*0         },
            { "x" : radius*-1/2, "y" : radius*-Math.sqrt(3)/2},
            { "x" : radius*1/2,  "y" : radius*-Math.sqrt(3)/2}
        ]
    }

    getStateConverter(){
        let state_to_color = new Map();
        state_to_color["DEFAULT"] = HEX_GRAY;
        state_to_color["IN_QUEUE"] = HEX_LIGHT_BLUE;
        state_to_color["VISITED"] = HEX_DARK_BLACK;
        state_to_color["IN_PATH"] = HEX_YELLOW;
        state_to_color["START"] = HEX_GREEN;
        state_to_color["END"] = HEX_RED;
        return state_to_color;
    }

    setState(state){
        if (this.state != "START" && this.state != "END") this.state = state;
    }
}

