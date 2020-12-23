/*
    This class will keep track of all the nodes for the travelling salesman to visit
    Each node will point to one other node, the hillcliming will then swap two random
    edges if they improve the total distance at all. 
*/

class SetOfPoints{
    constructor(num_of_points, HEIGHT, WIDTH){
        this.draw = this.draw.bind(this);
        this.generatePoints = this.generatePoints.bind(this);
        this.generateEdges = this.generateEdges.bind(this);
        this.dfsFlip = this.dfsFlip.bind(this);

        this.points = this.generatePoints(num_of_points, HEIGHT, WIDTH);
        this.edges = this.generateEdges(num_of_points);
        this.NUM_OF_POINTS = num_of_points;
        this.local_minima_reached = false;
    }

    draw(c){
        for (let i = 0; i < this.NUM_OF_POINTS; i++){
            let toIdx = this.edges[i];
            let toNode = this.points[toIdx];
            this.points[i].drawEdge(c, toNode);
        }
        
        
        for (let p of this.points){
            p.draw(c);
        }
    }

    climb(){ 
        // if we have reached the local minima we just skip the climbing altogether
        if (!this.local_minima_reached){

            let candidates = [] // all pairs of nodes, if a local improvement exists, it will be through swapping two nodes that will be in this list
            for (let i = 0; i < this.NUM_OF_POINTS; i++){
                for (let k = i+1; k < this.NUM_OF_POINTS; k++){
                    candidates.push(
                        {
                            "A" : i,
                            "C" : k
                        }
                    );    
                }
            }

            // TODO: shuffle the candidates array here to produce somewhat more visually interesting results

            for (let cand of candidates){
                // we dont need to know the total length, we know we are making an improvment if the sum of the two new
                // edges is smaller than the sum of the two old edges because all other edges stay the same
                
                // lets say that our old edges move from A to B, and from C to D;
                let Aidx = cand["A"];
                let Bidx = this.edges[Aidx];
                let Cidx = cand["C"];
                let Didx = this.edges[Cidx];
                let A = this.points[Aidx];
                let B = this.points[Bidx];
                let C = this.points[Cidx];
                let D = this.points[Didx];
                
                let oldDist = A.dist(B) + C.dist(D);
                let newDist = A.dist(C) + D.dist(B); // if we had done a->d and b->c we would have created two closed loops instead of one large

                if (newDist < oldDist){ // if we should climb in this direction
                    this.edges[Aidx] = Cidx;
                    //now the edges that used to go from B to C are facing the wrong way, lets flip them
                    this.dfsFlip(Bidx, Didx, Cidx);
                    return;
                }
            }
            this.local_minima_reached = true;
        }
    }

    //dfs for flipping the edges along a path
    dfsFlip(node, prev, end){
        if (node != end){
            this.dfsFlip(this.edges[node], node, end);
        }
        this.edges[node] = prev;
    }

    generatePoints(n, HEIGHT, WIDTH){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        let res = [];
        for(let i = 0; i < n; i++){
            let p;
            do {
                let x = Math.floor(Math.random()*(WIDTH-100) + 50);
                let y = Math.floor(Math.random()*(HEIGHT-100) + 50);
                p = new Point(x, y, 13);
            } while (res.some((e) => p.dist(e) <= 50)); //generate new point unless not all points are far enough away 
            
            res.push(p);
        }
        return res;
    }

    generateEdges(num_of_points){
        let edges = [];
        // this is an ok way to produce random edges because there is no correlation between where the nodes are
        for (let i = 0; i < num_of_points; i++){
            edges.push((i+1)%num_of_points); // add an edge to next index node
        }

        return edges;
    }
}