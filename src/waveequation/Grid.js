class Grid{
    constructor(w, h){
        this.w = w;
        this.h = h;

        this.grid = Array(3*w*h);
        this.init(w, h);
        this.iteration = 1;
    }


    // get index in flattened 3d array
    getidx(t, x, y, w, h){
        return t*w*h + y*w + x;
    }

    init(w, h){
        for (let i = 0; i < this.w; i++){
            for(let j = 0; j < this.h; j++){
                this.grid[this.getidx(0, i, j, w, h)] = -Math.exp (
                    -Math.pow(i-(w/4.0),2.0) / w
                    -Math.pow(j-(h/4.0),2.0) / h);
                this.grid[this.getidx(1, i, j, w, h)] = this.grid[this.getidx(0, i, j, w, h)]
                this.grid[this.getidx(2, i, j, w, h)] = 0.0
            }
        }
    }

    set_to_one(x, y){
        this.grid[this.getidx(1, x, y, this.w, this.h)] += 0.1;
    }

    display(cnv){
        for (let x = 0; x < this.w; x++){
            for (let y = 0; y < this.h; y++){
                let val = (this.grid[this.getidx(this.iteration%3, x, y, this.w, this.h)] + 1)/2;
                val = val*255;
                val = Math.min(val, 255);
                val = Math.floor(Math.max(val, 0));
                val = String(val);
                
                cnv.beginPath();
                cnv.fillStyle = "rgb(" + val + "," + val + "," + val + ")";
                cnv.rect(x, y, 1, 1);
                cnv.fill();
            }
        }
    }

    // periodic boundary conditions, 5pt stencil numerical solver
    iterate(){
        let next = (this.iteration + 1)%3;
        let cur = (this.iteration)%3;
        let prev = (this.iteration - 1)%3;
        let w = this.w;
        let h = this.h

        for (let x = 0; x < w; x++){
            for (let y = 0; y < h; y++){
                this.grid[this.getidx(next, y,x, w, h)] = 
                    2.0*this.grid[this.getidx(cur, y,x, w, h)] 
                    - this.grid[this.getidx(prev, y,x, w, h)] 
                    + (0.01) * (
                        -4.0*this.grid[this.getidx(cur,         y,        x, w, h)]
                            +this.grid[this.getidx(cur,   (y+1)%h,        x, w, h)]
                            +this.grid[this.getidx(cur, (y-1+h)%h,        x, w, h)]
                            +this.grid[this.getidx(cur,         y,  (x+1)%w, w, h)]
                            +this.grid[this.getidx(cur,         y,(x-1+w)%w, w, h)]
                );
            }
        }
        this.iteration++;
    }
}