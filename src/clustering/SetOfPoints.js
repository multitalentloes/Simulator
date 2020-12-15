class SetOfPoints{
    constructor(num_of_points, num_of_clusters, w, h){
        this.HEIGHT = h;
        this.WIDTH = w;
        this.NUM_OF_CLUSTERS = num_of_clusters;
        this.clusters = null;
        this.nextClusters = null
        this.centroids = this.generatePoints(this.NUM_OF_CLUSTERS, true);
        this.CH = null;
        this.points = this.generatePoints(num_of_points, false);

        this.grahamScan = this.grahamScan.bind(this);
        this.generatePoints = this.generatePoints.bind(this);
        this.draw = this.draw.bind(this);
    }

    draw(c){
        c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        if (this.nextClusters){
            for(let plist of this.nextClusters){
                if (plist.length > 0){
                    plist = this.grahamScan(plist);
                    c.fillStyle = "#CCFFCC";
                    c.beginPath();
                    c.moveTo(plist[0].pos.x, plist[0].pos.y);
                    for(let p of plist){
                        c.lineTo(p.pos.x, p.pos.y);
                    }
                    c.closePath();
                    c.fill();
                }
            }
        }

        for(let p of this.points){
            p.draw(c);
        }

        for(let cen of this.centroids){
            cen.draw(c);
        }
    }

    *k_means_clustering(){
        let is_change_made = false;
        do{
            /*
                nåværende:
                    beregn punktenes tilhørlighet
                    flytt centroider (tegn imens)
            */
            is_change_made = false;
            //marker nærmeste centroid for alle;
            for(let i = 0; i < this.points.length; i++){
                let p = this.points[i];
                for(let k = 0; k < this.centroids.length; k++){
                    //console.log(p.dist(this.centroids[k])-p.dist(this.centroids[p.cluster]))
                    if (p.dist(this.centroids[k]) < p.dist(this.centroids[p.cluster])){
                        if (k != p.cluster){
                            is_change_made = true;
                        }
                        this.points[i].cluster = k;
                    }
                }
            }

            //tegn skjermen på nytt
            this.clusters = new Array(this.NUM_OF_CLUSTERS);
            for(let i = 0; i < this.NUM_OF_CLUSTERS; i++){
                this.clusters[i] = []
            }

            for(let p of this.points){
                this.clusters[p.cluster].push(p);
            }

            //flytt centroid til gjennomsnitt av sine punkter
            let oldPos = this.centroids.map((e) => {
                return {
                    "x" : e.pos.x,
                    "y" : e.pos.y
                }
            });
            let newPos = [];
            for(let i = 0; i < this.NUM_OF_CLUSTERS; i++){
                let len = this.clusters[i].length;
                let x = this.centroids[i].pos.x;
                let y = this.centroids[i].pos.y;

                if (len > 0){
                    x = this.clusters[i].reduce((acc, e) => acc + e.pos.x, 0)/len;
                    y = this.clusters[i].reduce((acc, e) => acc + e.pos.y, 0)/len;
                }

                newPos.push({"x" : x, "y" : y})
            }

            let frames = 30; // number of frames to use for centroids to glide into new positions
            for(let i = 0; i < frames; i++){
                for(let k = 0; k < this.centroids.length; k++){
                    this.centroids[k].pos.x += (newPos[k].x - oldPos[k].x)/frames
                    this.centroids[k].pos.y += (newPos[k].y - oldPos[k].y)/frames
                }
                yield;
            }

            this.nextClusters = this.clusters;
            for(let i = 0; i < frames; i++){
                yield;
            }

        } while(is_change_made);
        yield;
    }

    grahamScan(points){
        //sort the points from left to right, favoring points with greater y
        let sorted = points.sort((a, b) => {
            if (a.pos.x < b.pos.x || (a.pos.x === b.pos.x && a.pos.y > b.pos.x)) return -1;
            if (a.pos.x == b.pos.x && a.pos.y == b.pos.y) return 0;
            return 1;
        })
        let first = sorted[0], last = sorted[sorted.length-1]
        let upper = [sorted[0]], lower = [sorted[0]];
        for(let i = 1; i < sorted.length; i++){
            if (this.cw(first, sorted[i], last) || i === sorted.length-1){
                while (upper.length >= 2 && !this.cw(upper[upper.length-2], upper[upper.length-1], sorted[i])){
                    let rm = upper.pop();
                }
                upper.push(sorted[i]);
            }
            if (this.ccw(first, sorted[i], last) || i === sorted.length-1){
                while (lower.length >= 2 && !this.ccw(lower[lower.length-2], lower[lower.length-1], sorted[i])){
                    let rm = lower.pop();
                }
                lower.push(sorted[i]);
            }
        }

        let ans = upper;
        for(let i = lower.length-2; i > 0; i--){
            ans.push(lower[i]);
        }
    
        return ans;
    }
    
    cw(a, b, c){
        return this.orientation(a, b, c) < 0;
    }

    ccw(a, b, c){
        return this.orientation(a, b, c) > 0;
    }

    orientation(a, b, c){
        return a.pos.x*(b.pos.y-c.pos.y)+b.pos.x*(c.pos.y-a.pos.y)+c.pos.x*(a.pos.y-b.pos.y);
    }

    generatePoints(n, display_as_rect){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        let res = [];
        for(let i = 0; i < n; i++){
            let p;
            do {
                let x = Math.floor(Math.random()*(this.WIDTH-100) + 50);
                let y = Math.floor(Math.random()*(this.HEIGHT-100) + 50);
                p = new Point(x, y, 15, 0, display_as_rect, (display_as_rect ? "#0000FF" : "#333333"));
            } while (res.some((e) => p.dist(e) <= 30)); //generate new point unless not all points are far enough away 

            res.push(p);
        }
        return res;
    }
}