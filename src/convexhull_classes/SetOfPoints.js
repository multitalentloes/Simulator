class SetOfPoints{
    constructor(set){
        this.points = set;
        this.CH = this.grahamScan(); // points in convex hull


        this.grahamScan = this.grahamScan.bind(this);
    }

    draw(c){
        for(let p of this.points){
            p.draw(c);
        }
    }

    grahamScan(){
        //sort the points from left to right, favoring points with greater y
        let sorted = this.points.sort((a, b) => {
            if (a.pos.x < b.pos.x || (a.pos.x === b.pos.x && a.pos.y > b.pos.x)) return -1;
            if (a.pos.x == b.pos.x && a.pos.y == b.pos.y) return 0;
            return 1;
        })

        let first = sorted[0], last = sorted[sorted.length-1]
        let upper = [sorted[0]], lower = [sorted[0]];
        for(let i = 1; i < sorted.length; i++){
            if (this.cw(first, sorted[i], last) || i === sorted.length-1){
                while (upper.length >= 2 && !this.cw(upper[upper.length-2], upper[upper.length-1], sorted[i])){
                    upper.pop();
                }
                upper.push(sorted[i]);
            }
            if (this.ccw(first, sorted[i], last) || i === sorted.length-1){
                while (lower.length >= 2 && !this.ccw(lower[lower.length-2], lower[lower.length-1], sorted[i])){
                    lower.pop();
                }
                lower.push(sorted[i]);
            }
        }

        let ans = upper;
        for(let i = lower.length-2; i > 0; i--){
            ans.push(lower[i]);
        }
        for(let i = 0; i < ans.length; i++){
            ans[i].draw_color = "#FF0000";
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
}