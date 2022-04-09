class Grid{
    constructor(xdim, ydim, canvasx, canvasy){
        this.xdim = xdim;
        this.ydim = ydim;
        this.canvasx = canvasx;
        this.canvasy = canvasy;
        this.grid;
        this.lines;

        this.contour_heights = []; // TODO: create logic to just look for each 10 up the max grid point value
        for (let i = 10; i < 180; i += 10){
            this.contour_heights.push(i);
        }


        this.createGridPoints();

        this.draw = this.draw.bind(this);
    }

    draw(c){
        for (let line of this.lines){
            line.draw(c);
        }
    }

    updateHeights(increase_pos, cursor_radius){
        let cursor_radius_sqr = cursor_radius*cursor_radius;
        for (let i = 0; i < this.ydim; i++){
            for (let j = 0; j < this.xdim; j++){
                let dist_sqr = this.grid[i][j].cursor_dist_sqr(increase_pos)
                if (dist_sqr <= cursor_radius_sqr){
                    this.grid[i][j].value += 4 - 4*dist_sqr/cursor_radius_sqr;
                }
            }
        }
    }

    createGridPoints(){
        this.grid = [];
        for (let i = 0; i <= this.ydim; i++){
            this.grid.push([]);
            for (let j = 0; j <= this.xdim; j++){
                let xpos = i*this.canvasx/this.xdim;
                let ypos = j*this.canvasy/this.ydim;
                this.grid[i].push(new Point(xpos, ypos, 10, 0));
            }
        }
    }

    //algorithm for drawing contour lines on the topographic map
    // feed in a rectangle we should update with new lines, no point in going over the entire grid
    marchingSquares(fromx, fromy, tox, toy){
        this.lines = [];
        let square_width = this.canvasx/(this.xdim); // might be off by one
        let square_height = this.canvasy/(this.ydim); // might be off by one
        let j_start = Math.max(1, Math.floor(fromx/square_width)-5);
        let i_start = Math.max(1, Math.floor(fromy/square_height)-5);
        let j_end = Math.min(this.xdim, Math.ceil(tox/square_width)+5);
        let i_end = Math.min(this.ydim, Math.ceil(toy/square_height)+5);

        for (let i = i_start; i <= i_end; i++){
            for (let j = j_start; j <= j_end; j++){
                for (let contour of this.contour_heights){
                    let ul = this.grid[j-1][i-1].value > contour; // upper left
                    let ll = this.grid[j][i-1].value > contour; // lower left
                    let ur = this.grid[j-1][i].value > contour; // upper right
                    let lr = this.grid[j][i].value > contour; // lower right

                    let onlyul = !lr && !ur && !ll && ul;
                    let onlyll = !lr && !ur && ll && !ul;
                    let onlyur = !lr && ur && !ll && !ul;
                    let onlylr = lr && !ur && !ll && !ul;
                    let allbutul = lr && ur && ll && !ul;
                    let allbutll = lr && ur && !ll && ul;
                    let allbutur = lr && !ur && ll && ul;
                    let allbutlr = !lr && ur && ll && ul;
                    let onlyleft = !lr && !ur && ll && ul;
                    let onlyright = lr && ur && !ll && !ul;
                    let onlyupper = !lr && ur && !ll && ul;
                    let onlylower = lr && !ur && ll && !ul;
                    let ullrdiag = lr && !ur && !ll && ul;
                    let llurdiag = !lr && ur && ll && !ul;

                    // lower right corner line
                    if (onlylr || allbutlr || llurdiag){
                        let linestart = this.getPointBetween(this.grid[j][i], this.grid[j-1][i], contour);
                        let lineend = this.getPointBetween(this.grid[j][i], this.grid[j][i-1], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                    // upper right corner line
                    if (onlyur || allbutur || ullrdiag){
                        let linestart = this.getPointBetween(this.grid[j][i], this.grid[j-1][i], contour);
                        let lineend = this.getPointBetween(this.grid[j-1][i], this.grid[j-1][i-1], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                    // lower left corner line
                    if (onlyll || allbutll || ullrdiag){
                        let linestart = this.getPointBetween(this.grid[j-1][i-1], this.grid[j][i-1], contour);
                        let lineend = this.getPointBetween(this.grid[j][i], this.grid[j][i-1], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                    // upper left corner line
                    if (onlyul || allbutul || llurdiag){
                        let linestart = this.getPointBetween(this.grid[j-1][i-1], this.grid[j-1][i], contour);
                        let lineend = this.getPointBetween(this.grid[j-1][i-1], this.grid[j][i-1], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                    // vertical line
                    if (onlyleft || onlyright){
                        let linestart = this.getPointBetween(this.grid[j-1][i-1], this.grid[j-1][i], contour);
                        let lineend = this.getPointBetween(this.grid[j][i], this.grid[j][i-1], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                    // horizontal line
                    if (onlyupper || onlylower){
                        let linestart = this.getPointBetween(this.grid[j-1][i-1], this.grid[j][i-1], contour);
                        let lineend = this.getPointBetween(this.grid[j][i], this.grid[j-1][i], contour);
                        this.lines.push(new Line(linestart, lineend));
                    }
                }
            }
        }
    }

    getPointBetween(pta, ptb, contour){
        let mid = new Point((pta.pos.x + ptb.pos.x)/2, (pta.pos.y + ptb.pos.y)/2, 0, (pta.value + ptb.value)/2);
        for (let i = 0; i < 8; i++){
            if (pta.value > contour == mid.value > contour){ // the correct point is between mid and ptb, move pta to mid and repeat
                pta = new Point(mid.pos.x, mid.pos.y, 0, mid.value);
                mid = new Point((pta.pos.x + ptb.pos.x)/2, (pta.pos.y + ptb.pos.y)/2, 0, (pta.value + ptb.value)/2);
            }
            else{ // the correct point is between mid and pta, move ptb to mid and adjust mid
                ptb = new Point(mid.pos.x, mid.pos.y, 0, mid.value);
                mid = new Point((ptb.pos.x + pta.pos.x)/2, (ptb.pos.y + pta.pos.y)/2, 0, (pta.value + ptb.value)/2);
            }
        }
        return mid;
    }
}

//TODO only update the changed squares. This should work since all changes happens within a square, just tell it to redraw a small square that the cursor fits within