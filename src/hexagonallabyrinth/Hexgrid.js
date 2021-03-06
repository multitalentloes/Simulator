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

        this.xexagonCoordinates;
        this.setHexagonCoordinates();

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

    setHexagonCoordinates(){
        this.hexagonCoordinates = [];
        for(let i = 0; i < this.xhexagons; i++){ // for each column
            for (let k = 0; k < this.yhexagons; k++){ // for each cell in that column (iterates over rows)
                this.hexagonCoordinates.push({ // based on https://www.redblobgames.com/grids/hexagons/#distances
                    "x" : i,
                    "y" : i/2 - k,
                    "z" : i - i/2 + k
                });
            }
        }
    }
    
    // perform a randomized DFS, breach walls where the dfs goes
    *generateDFSLabyrinth(){
        this.reset_grid();
        let stack = [0]; // use this list a stack for the dfs
        let visited = [true] // first node is already in the stack
        for(let i = 0; i < this.hexagons.length - 1; i++){
            visited.push(false);
        }
        while (stack.length > 0){ // while some nodes are not fully explored
            let curr = stack.pop();
            let neighbors = shuffleArray(this.getNeighboringNodeIdxs(curr)); // randomize the order in which the neighbors will be visited
            for (let n of neighbors){
                if (!visited[n]){ // if we havent visited this node yet
                    visited[n] = true;
                    this.removeWall(Math.min(curr, n), Math.max(curr, n)); 
                    stack.push(n);
                    yield;
                }
            }
        }

        // to make the solution a bit more interesting lets poke some holes in the labyrinth as it only has one solution at the moment
        for(let i = 0; i < this.hexagons.length; i++){
            let n = shuffleArray(this.getNeighboringNodeIdxs(i))[0]; // pick a random neighbor
            this.removeWall(Math.min(i, n), Math.max(i, n))
            yield;
        }
    }

    //union neighboring nodes until we are left with only one component in the graph
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
        walls = shuffleArray(walls);
        
        //go over the walls and remove them if their nodes are in seperate sets, break early if we only have 1 set
        
        for(let W of walls){
            if (!this.UF.isSameSet(W[0], W[1])){
                this.UF.unify(W[0], W[1]);
                
                this.hexagons[W[0]].setState("MERGING");
                this.hexagons[W[1]].setState("MERGING");

                this.removeWall(W[0], W[1]); 

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

    *AStarMeetInTheMiddle(){ // not actually optimal
        let visited = []; // visited[idx] == 0 -> unvisited, 1 -> visted by a* number one, 2 -> visited by a* number two
        let numNodes = this.hexagons.length;
        let firstSearchLastNode;
        let secondSearchLastNode;
        
        for (let i = 0; i < numNodes; i++){
            visited.push(0);
        }
        let est_dist = this.minDistance(this.startNode, this.goalNode)

        let PQ1 = [{"dist_here" : 0, "est_dist_left" : est_dist, "heuristic" : est_dist, "node" : this.startNode, "prev" : -1}];

        let PQ2 = [{"dist_here" : 0, "est_dist_left" : est_dist, "heuristic" : est_dist, "node" : this.goalNode, "prev" : -1}];

        let prev = []; // keep track of the previous node visited to construct the solution path
        for (let i = 0; i < numNodes; i++){
            prev.push(-1); // no previous node yet
        }

        while (true){ // logic for terminating the search is inside the loop

            let curr1 = PQ1.shift();
            this.hexagons[curr1.node].setState("VISITED");
            if (visited[curr1.node] == 2) {
                firstSearchLastNode = curr1.prev;
                secondSearchLastNode = curr1.node;
                break; // terminate as we found a node the other search has visited
            }
            if (visited[curr1.node] == 1) continue;
            visited[curr1.node] = 1;
            prev[curr1.node] = curr1.prev;

            let neighbors = shuffleArray(this.getAdjacentNodeIdxs(curr1.node));

            for (let n of neighbors){
                if (visited[n] != 1){ // consider nodes not yet visited in this search
                    let nextNode = {};
                    nextNode.dist_here = curr1.dist_here+1;
                    nextNode.est_dist_left = this.minDistance(curr1.node, this.goalNode);
                    nextNode.heuristic = nextNode.dist_here + nextNode.est_dist_left;
                    nextNode.node = n;
                    nextNode.prev = curr1.node;
                    
                    PQ1.push(nextNode);
                }
            }

            let curr2 = PQ2.shift();
            this.hexagons[curr2.node].setState("VISITED");
            if (visited[curr2.node] == 1) {
                secondSearchLastNode = curr2.prev;
                firstSearchLastNode = curr2.node;
                break; // terminate as we found a node the other search has visited
            }
            if (visited[curr2.node] == 2) continue;
            visited[curr2.node] = 2;
            prev[curr2.node] = curr2.prev;

            neighbors = shuffleArray(this.getAdjacentNodeIdxs(curr2.node));
            yield;

            for (let n of neighbors){
                if (visited[n] != 2){ // consider nodes not yet visited in this search
                    let nextNode = {};
                    nextNode.dist_here = curr2.dist_here+1;
                    nextNode.est_dist_left = this.minDistance(curr2.node, this.startNode);
                    nextNode.heuristic = nextNode.dist_here + nextNode.est_dist_left;
                    nextNode.node = n;
                    nextNode.prev = curr2.node;
                    
                    PQ2.push(nextNode);
                }
            }

            PQ1.sort(this.comparePQElements);
            PQ2.sort(this.comparePQElements);
        }

        let path = [];
        let firstSearchNode = firstSearchLastNode
        while (prev[firstSearchNode] != -1){
            path.unshift(firstSearchNode);
            firstSearchNode = prev[firstSearchNode];
        }

        let secondSearchNode = secondSearchLastNode
        while (prev[secondSearchNode] != -1){
            path.push(secondSearchNode);
            secondSearchNode = prev[secondSearchNode];
        }

        for(let idx of path){
             this.hexagons[idx].setState("IN_PATH");
             yield;
        }
    }

    comparePQElements(a, b){
        let heurDiff = a.heuristic - b.heuristic;

        if (heurDiff == 0) return heurDiff; // always pick node closest to goal

        return b.dist_here - a.dist_here; // tiebreaker: use node that is the furthest away from start
    }

    getNeighboringNodeIdxs(node){ // returns alle the nodes next to the current one in the animated grid
        let ans = [];
        let col = this.yhexagons;
        let row = this.xhexagons;

        let upperColumn = node%(2*col) < col; // kinda bad name, but the first column starts "above" the next, these higher columns are "upperColumn"
        let top = node%col == 0;
        let bottom = node%col == col-1;
        let left = node < col;
        let right = node >= col*(row-1)

        if (!right && (!bottom || upperColumn)) ans.push(node + col + (upperColumn ? 0 : 1)); // go southeast
        if (!bottom) ans.push(node+1)// go south
        if (!left && (!bottom || upperColumn)) ans.push(node - col + (upperColumn ? 0 : 1)); // go southwest
        if (!left && (!top || !upperColumn)) ans.push(node - col + (upperColumn ? -1 : 0)); // go northwest
        if (!top) ans.push(node-1)// go north
        if (!right && (!top || !upperColumn)) ans.push(node + col + (upperColumn ? -1 : 0)); // go northeast
        return ans;
    }

    getAdjacentNodeIdxs(node){ // returns all the nodes next to the current one in the graph
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

    // given indices of two neighboring hexagons, remove the edge between them. Assumes idxa < idxb
    removeWall(idxa, idxb){
        let col = this.yhexagons;
        let duoCol = 2*col;
        let diff = idxb - idxa;

        if (diff == 1){ //up/down
            this.hexagons[idxa].edges[1] = true;
            this.hexagons[idxb].edges[4] = true;
        }
        else if (diff == col){
            if (idxa%duoCol < col){ // if we are on starting column
                this.hexagons[idxa].edges[0] = true;
                this.hexagons[idxb].edges[3] = true;
            }
            else{
                this.hexagons[idxa].edges[5] = true;
                this.hexagons[idxb].edges[2] = true;
            }
        }
        else if (diff == col - 1){
            this.hexagons[idxa].edges[5] = true;
            this.hexagons[idxb].edges[2] = true;
        }
        else if(diff == col + 1){
            this.hexagons[idxa].edges[0] = true;
            this.hexagons[idxb].edges[3] = true;
        }
    }

    minDistance(idxa, idxb){ // the smallest hexagon distance between two hexagons 
        let a = this.hexagonCoordinates[idxa];
        let b = this.hexagonCoordinates[idxb];
        let dx = Math.abs(a.x-b.x);
        let dy = Math.abs(a.y-b.y);
        let dz = Math.abs(a.z-b.z);
        return Math.max(dx, dy, dz);
    }
}

function shuffleArray(array){
    for (let i = 0; i < array.length; i++){
        let idx = Math.floor(Math.random()*array.length);
        let tmp = array[idx];
        array[idx] = array[i];
        array[i] = tmp;
    }
    return array
}

