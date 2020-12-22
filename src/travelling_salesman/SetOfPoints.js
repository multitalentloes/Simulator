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

        this.points = this.generatePoints(num_of_points, HEIGHT, WIDTH);
        this.edges = this.generateEdges(num_of_points);
        this.NUM_OF_POINTS = num_of_points;
    }

    draw(c){
        /*
        for (let i = 0; i < this.NUM_OF_POINTS; i++){
            let toIdx = this.edges[i];
            let toNode = this.points[toIdx];
            this.points[i].drawEdge(c, toNode);
        }
        */
        
        for (let p of this.points){
            p.draw(c);
        }
    }

    climb(){ 
        // basic implementation of hill climing algorithm, if we see a change that improves total distance, make the change
        // produce all permuations of two selected points
        // shuffle the list
        // iterate though it
        // for it pair, calculate the total distance if that change was made
        // break when an improvment is made, otherwise flip a boolean that will skip the climb from here on out (local minima is reached)
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
        let idxs = []
        let edges = []
        for (let i = 0; i < num_of_points; i++){
            idxs.push(i);
        }

        // for each node, pick a random index among the nodes that have not been chosen, as long as this node is not itself
        // create an edge to it.
        for (let i = 0; i < num_of_points; i++){
            let edgeTo = NaN;
            do{
                edgeTo = Math.floor(Math.random()*idxs.length);
            } while(idxs[edgeTo] == i); // we dont want an edge from and to the same node
            edges.push(idxs[edgeTo]);
            idxs.splice(edgeTo, 1);
        }

        return edges;
    }
}