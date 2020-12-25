class SetOfPoints{
    constructor(set){
        this.points = set;
        this.lines = []; // lines to be drawn
        this.candidates = []; // all lines that are being considered as the next edge in the mst
        this.visited = [];
        this.RED="#AA0000";
        this.GREEN="#009900";
        this.NUM_OF_POINTS = set.length;

        this.prims_algorithm = this.prims_algorithm.bind(this);
    }

    draw(c){        
        for(let l of this.lines){
            l.draw(c);
        }
        
        for(let p of this.points){
            p.draw(c);
        }
    }

    *prims_algorithm(){
        yield true;
        yield true;
        yield true;
        
        this.visited = [];
        for (let i = 0; i < this.NUM_OF_POINTS; i++){
            this.visited.push(false);
        }
        this.candidates = [{"dist" : 0, "from" : 0, "to" : 0}]
        for (let i = 0; i < this.NUM_OF_POINTS - 1; i++){
            let current = this.candidates.shift().to;
            this.visited[current] = true;
            for (let k = 0; k < this.NUM_OF_POINTS; k++){
                const to = {"x" : this.points[k].pos.x, "y" : this.points[k].pos.y};
                const from = {"x" : this.points[current].pos.x, "y" : this.points[current].pos.y};
                const vec = {"x" : to.x - from.x, "y" : to.y - from.y};
                this.candidates.push({"dist" : vec.x*vec.x + vec.y*vec.y, "from" : current, "to" : k});
            }

            this.candidates = this.candidates.filter(e => !this.visited[e.to]); // remove all edges going to visited nodes

            this.candidates.sort(function(a, b){ //sort the unvisited nodes by increasing edge distance
                return a.dist > b.dist ? 1 : a.dist == b.dist ? 0 : -1;
            });

            
            if (this.candidates.length > 0){
                let best = this.candidates[0];
                this.lines.push(new Line(this.points[best.from], this.points[best.to]))
                yield true;
            }
        }

        yield
    }
}