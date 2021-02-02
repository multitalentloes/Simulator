class SetOfPoints{
    constructor(set){
        this.points = set;
        this.lines = [];
        this.RED="#AA0000";
        this.GREEN="#009900"
        this.CH = null;

        this.grahamScan = this.grahamScan.bind(this);
        this.draw = this.draw.bind(this);
    }

    draw(c){
        if (this.CH){
            c.fillStyle = "#EEFFEE";
            c.beginPath();
            c.moveTo(this.CH[0].pos.x, this.CH[0].pos.y);
            for(let p of this.CH){
                c.lineTo(p.pos.x, p.pos.y);
            }
            c.closePath();
            c.fill();
        }
        
        for(let l of this.lines){
            l.draw(c);
        }
        
        for(let p of this.points){
            p.draw(c);
        }
    }

    *grahamScan(){
        //sort the points from left to right, favoring points with greater y
        let sorted = this.points.sort((a, b) => {
            if (a.pos.x < b.pos.x || (a.pos.x === b.pos.x && a.pos.y > b.pos.x)) return -1;
            if (a.pos.x == b.pos.x && a.pos.y == b.pos.y) return 0;
            return 1;
        })

        yield true;
        yield true;
        let first = sorted[0], last = sorted[sorted.length-1]
        let upper = [sorted[0]], lower = [sorted[0]];
        for(let i = 1; i < sorted.length; i++){
            if (this.cw(first, sorted[i], last) || i === sorted.length-1){
                while (upper.length >= 2 && !this.cw(upper[upper.length-2], upper[upper.length-1], sorted[i])){
                    let rm = upper.pop();
                    this.lines = this.lines.filter(e => {
                        return !e.p1.equals(rm) && !e.p2.equals(rm);
                    })
                    this.lines.push(new Line (upper[upper.length-1], rm, this.RED));
                    this.lines.push(new Line (rm, sorted[i], this.RED));
                    yield true;
                    this.lines = this.lines.filter(e => e.color != this.RED);
                }
                upper.push(sorted[i]);
                this.lines.push(new Line(upper[upper.length-2], upper[upper.length-1], this.GREEN));
                yield true
            }
            if (this.ccw(first, sorted[i], last) || i === sorted.length-1){
                while (lower.length >= 2 && !this.ccw(lower[lower.length-2], lower[lower.length-1], sorted[i])){
                    let rm = lower.pop();
                    this.lines = this.lines.filter(e => {
                        return !e.p1.equals(rm) && !e.p2.equals(rm) //e er ulik både start og slutt
                    })
                    this.lines.push(new Line (lower[lower.length-1], rm, this.RED));
                    this.lines.push(new Line (rm, sorted[i], this.RED));
                    yield true
                    this.lines = this.lines.filter(e => e.color != this.RED);
                }
                lower.push(sorted[i]);
                this.lines.push(new Line(lower[lower.length-2], lower[lower.length-1], this.GREEN));
                yield true
            }
        }

        let ans = upper;
        for(let i = lower.length-2; i > 0; i--){
            ans.push(lower[i]);
        }
    
        this.CH = ans;
        yield;
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