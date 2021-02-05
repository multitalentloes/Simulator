class Hexgrid{
    constructor(radius){
        this.WIDTH  = 1920;
        this.HEIGHT = 1080;
        
        this.radius = radius; // radius of a single hexagon

        this.hexagons = [];

        const XSTART = 90;
        const YSTART = 90;
        this.xhexagons = 0;

        this.animation = this.placeholder();


        for(let i = 0; 150 + i*radius*3 < this.WIDTH; i++){
            this.xhexagons = Math.max(this.xhexagons, (i+1)*2);
            for(let j = 0; YSTART + j*radius*(1 + Math.sqrt(3)/2) < this.HEIGHT; j++){ // adds a vertical line of hexagons
                let x = XSTART + 3*i*radius;
                let y = YSTART + j*radius*Math.sqrt(3);

                this.hexagons.push(new Node(radius, x, y));
            }
            for(let j = 0; YSTART + j*radius*(1 + Math.sqrt(3)/2) < this.HEIGHT; j++){ // adds a vertical line of hexagons
                let x = XSTART + 3*i*radius + radius * (3/2);
                let y = YSTART + j*radius*Math.sqrt(3) + radius*Math.sqrt(3)/2;

                this.hexagons.push(new Node(radius, x, y));
            }
        }
        this.yhexagons = this.hexagons.length / this.xhexagons;

        this.startNode = 0;
        this.goalNode = this.hexagons.length - 1;

        this.hexagons[this.startNode].setState("START");
        this.hexagons[this.goalNode].setState("END");

        this.UF = new UnionFind(this.hexagons.length);
    }

    *placeholder(){
        while (true){
            yield;
        }
    }

    draw(c){
        for (let X of this.hexagons){
            X.draw(c);
        }
    }

    reset_grid(){ // reset all nodes to initial state
        for (let i = 0; i < this.hexagons.length; i++){
            this.hexagons[i].edges = [false, false, false, false, false, false];
            this.hexagons[i].setState("DEFAULT");
        }
        this.UF = new UnionFind(this.hexagons.length);
    }
    
    *generateKruskalLabyrinth(){
        // create a shuffled list of all the walls
        // each wall will be added if we for all nodes add 3 pairs, one for each neighboor along wall 0->2
        this.reset_grid();
        let walls = [];
        let col = this.yhexagons;
        let duoCol = 2*col;
        let rows = this.xhexagons;
        for(let i = 0; i < this.hexagons.length; i++){
            if (i%duoCol != 0 && i < (rows-1)*col){ // if not on duoCol top and not on right edge
                if(i%duoCol < col){ walls.push([i, i+col-1]); } // first column add upper right
                else{walls.push([i, i+col]); } // second column add upper right
            }
            if (i%col > 0){
                walls.push([i-1, i]); // add above
            }
            if (i >= col && i%duoCol > 0){ // add upper left
                if (i%duoCol < col){ walls.push([i-col-1, i]); } // first column
                else{walls.push([i-col, i]); } // second column
            }
        }
        
        // shuffle the walls
        for (let i = 0; i < walls.length; i++){
            let idx = Math.floor(Math.random()*walls.length);
            let tmp = walls[idx];
            walls[idx] = walls[i];
            walls[i] = tmp;
        }
        
        //go over the walls and remove them if their nodes are in seperate sets, break early if we only have 1 set
        
        for(let W of walls){
            if (!this.UF.isSameSet(W[0], W[1])){
                this.UF.unify(W[0], W[1]);
                let diff = W[1] - W[0];
                
                this.hexagons[W[0]].setState("MERGING");
                this.hexagons[W[1]].setState("MERGING");

                if (diff == 1){ //up/down
                    this.hexagons[W[0]].edges[1] = true;
                    this.hexagons[W[1]].edges[4] = true;
                }
                else if (diff == col){
                    if (W[0]%duoCol < col){ // if we are on starting column
                        this.hexagons[W[0]].edges[0] = true;
                        this.hexagons[W[1]].edges[3] = true;
                    }
                    else{
                        this.hexagons[W[0]].edges[5] = true;
                        this.hexagons[W[1]].edges[2] = true;
                    }
                }
                else if (diff == col - 1){
                    this.hexagons[W[0]].edges[5] = true;
                    this.hexagons[W[1]].edges[2] = true;
                }
                else if(diff == col + 1){
                    this.hexagons[W[0]].edges[0] = true;
                    this.hexagons[W[1]].edges[3] = true;
                }
                yield;
                yield;
                yield;
                this.hexagons[W[0]].setState("DEFAULT");
                this.hexagons[W[1]].setState("DEFAULT");
            }
            if (this.UF.numSets == 1) break;
        }
    }

    *BFS(){  
        let visited = [];
        let prev = []
        for (let i = 0; i < this.hexagons.length; i++){
            visited.push(false);
            prev.push(-1); // -1 indicates no previous node
        }
        visited[this.startNode] = true;

        let q = [this.startNode]; // add the starting node to the queue

        while (q.length > 0){
            let node = q.shift();
            this.hexagons[node].setState("VISITED")
            yield;
            if (node == this.goalNode) break;

            let adj = this.getAdjacentNodeIdxs(node);

            for (let next of adj){
                if (!visited[next]){
                    visited[next] = true;
                    prev[next] = node;
                    q.push(next);
                    this.hexagons[next].setState("IN_QUEUE");
                }
            }
            yield;
        }

        let node = this.hexagons.length - 1;
        let path_animation_sequence = [];
        do {
            path_animation_sequence.push(node);
            node = prev[node]; 
        } while (node != -1);

        for(let i = path_animation_sequence.length - 1; i >= 0; i--){
            this.hexagons[path_animation_sequence[i]].setState("IN_PATH");
            yield;
        }
    }

    getAdjacentNodeIdxs(node){
        let ans = [];
        let col = this.yhexagons;
        let row = this.xhexagons;
        let edg = this.hexagons[node].edges;

        let upperColumn = node%(2*col) < col; // kinda bad name, but the first column starts "above" the next, these higher columns are "upperColumn"
        let top = node%col == 0;
        let bottom = node%col == col-1;
        let left = node < col;
        let right = node >= col*(row-1)

        if (!right && (!bottom || upperColumn) && edg[0]) ans.push(node + col + (upperColumn ? 0 : 1)); // go southeast
        if (!bottom && edg[1]) ans.push(node+1)// go south
        if (!left && (!bottom || upperColumn) && edg[2]) ans.push(node - col + (upperColumn ? 0 : 1)); // go southwest
        if (!left && (!top || !upperColumn) && edg[3]) ans.push(node - col + (upperColumn ? -1 : 0)); // go northwest
        if (!top > 0 && edg[4]) ans.push(node-1)// go north
        if (!right && (!top || !upperColumn) && edg[5]) ans.push(node + col + (upperColumn ? -1 : 0)); // go northeast
        
        return ans;
    }
}

