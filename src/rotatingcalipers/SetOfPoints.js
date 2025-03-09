class SetOfPoints {
    constructor(set) {
        this.points = set;
        this.lines = [];
        this.RED = "#AA0000";
        this.GREEN = "#009900"
        this.CH = null;

        this.grahamScan = this.grahamScan.bind(this);
        this.grahamScan();
        this.rotatingCalipers = this.rotatingCalipers.bind(this);
        this.draw = this.draw.bind(this);

        this.OMBB = this.rotatingCalipers(this.CH);
    }

    draw(c) {
        if (this.CH) {
            c.fillStyle = "#EEFFEE";
            c.beginPath();
            c.moveTo(this.CH[0].pos.x, this.CH[0].pos.y);
            for (let p of this.CH) {
                c.lineTo(p.pos.x, p.pos.y);
            }
            c.closePath();
            c.fill();

            c.fillStyle = "#FF0000";
            for (let i = 0; i < this.OMBB.length; i++) {
                c.beginPath();
                c.moveTo(this.OMBB[i].pos.x, this.OMBB[i].pos.y);
                c.lineTo(this.OMBB[(i + 1) % this.OMBB.length].pos.x, this.OMBB[(i + 1) % this.OMBB.length].pos.y);
                c.stroke();
            }
        }

        for (let l of this.lines) {
            l.draw(c);
        }

        for (let p of this.points) {
            p.draw(c);
        }
    }

    grahamScan() {
        //sort the points from left to right, favoring points with greater y
        let sorted = this.points.sort((a, b) => {
            if (a.pos.x < b.pos.x || (a.pos.x === b.pos.x && a.pos.y > b.pos.x)) return -1;
            if (a.pos.x == b.pos.x && a.pos.y == b.pos.y) return 0;
            return 1;
        })
        let first = sorted[0], last = sorted[sorted.length - 1]
        let upper = [sorted[0]], lower = [sorted[0]];
        for (let i = 1; i < sorted.length; i++) {
            if (this.cw(first, sorted[i], last) || i === sorted.length - 1) {
                while (upper.length >= 2 && !this.cw(upper[upper.length - 2], upper[upper.length - 1], sorted[i])) {
                    let rm = upper.pop();
                    this.lines = this.lines.filter(e => {
                        return !e.p1.equals(rm) && !e.p2.equals(rm);
                    })
                }
                upper.push(sorted[i]);
                this.lines.push(new Line(upper[upper.length - 2], upper[upper.length - 1], this.GREEN));
            }
            if (this.ccw(first, sorted[i], last) || i === sorted.length - 1) {
                while (lower.length >= 2 && !this.ccw(lower[lower.length - 2], lower[lower.length - 1], sorted[i])) {
                    let rm = lower.pop();
                    this.lines = this.lines.filter(e => {
                        return !e.p1.equals(rm) && !e.p2.equals(rm) //e er ulik både start og slutt
                    })
                }
                lower.push(sorted[i]);
                this.lines.push(new Line(lower[lower.length - 2], lower[lower.length - 1], this.GREEN));
            }
        }

        let ans = upper;
        for (let i = lower.length - 2; i > 0; i--) {
            ans.push(lower[i]);
        }

        this.CH = ans;
    }

    cw(a, b, c) {
        return this.orientation(a, b, c) < 0;
    }

    ccw(a, b, c) {
        return this.orientation(a, b, c) > 0;
    }

    orientation(a, b, c) {
        return a.pos.x * (b.pos.y - c.pos.y) + b.pos.x * (c.pos.y - a.pos.y) + c.pos.x * (a.pos.y - b.pos.y);
    }


    cross(o, a, b) {
        return (a.pos.x - o.pos.x) * (b.pos.y - o.pos.y) - (a.pos.y - o.pos.y) * (b.pos.x - o.pos.x);
    }

    angleBetweenVectors2D(v2, v1) {
        v1 = v1.divide(Math.sqrt(v1.pos.x ** 2 + v1.pos.y ** 2));
        v2 = v2.divide(Math.sqrt(v2.pos.x ** 2 + v2.pos.y ** 2));

        let dot = v1.pos.x * v2.pos.x + v1.pos.y * v2.pos.y;
        dot = Math.min(1, Math.max(-1, dot));
        let angleRad = Math.acos(dot);

        const crossZ = v1.pos.x * v2.pos.y - v1.pos.y * v2.pos.x;
        const sign = Math.sign(crossZ);

        let angleDeg = angleRad * (180 / Math.PI);
        if (sign < 0) {
            angleDeg = 360 - angleDeg;
        }

        return angleDeg < 360 ? angleDeg : 0;
    }

    rotateVector(v, angle) {
        angle = -angle;
        const x = v.pos.x * Math.cos(angle * (Math.PI / 180)) - v.pos.y * Math.sin(angle * (Math.PI / 180));
        const y = v.pos.x * Math.sin(angle * (Math.PI / 180)) + v.pos.y * Math.cos(angle * (Math.PI / 180));
        return new Point(x, y, 15);
    }

    distance(p1, p2) {
        return Math.sqrt((p1.pos.x - p2.pos.x) ** 2 + (p1.pos.y - p2.pos.y) ** 2);
    }

    lineIntersection(p1, p2, p3, p4) {
        const denom = (p1.pos.x - p2.pos.x) * (p3.pos.y - p4.pos.y) - (p1.pos.y - p2.pos.y) * (p3.pos.x - p4.pos.x);
        if (denom === 0) {
            return null;
        }
        const x = ((p1.pos.x * p2.pos.y - p1.pos.y * p2.pos.x) * (p3.pos.x - p4.pos.x) - (p1.pos.x - p2.pos.x) * (p3.pos.x * p4.pos.y - p3.pos.y * p4.pos.x)) / denom;
        const y = ((p1.pos.x * p2.pos.y - p1.pos.y * p2.pos.x) * (p3.pos.y - p4.pos.y) - (p1.pos.y - p2.pos.y) * (p3.pos.x * p4.pos.y - p3.pos.y * p4.pos.x)) / denom;
        return new Point(x, y, 15);
    }

    rotatingCalipers(hull) {
        console.log(hull);
        const n = hull.length;
        console.log(n);
        let minArea = Infinity;
        let bestRectangle = [];

        let minYVal = 999999;
        let minXVal = 999999;
        let maxYVal = -999999;
        let maxXVal = -999999;
        let minYIdx = -1;
        let maxYIdx = -1;
        let minXIdx = -1;
        let maxXIdx = -1;

        for (let i = 0; i < n; i++) {
            if (hull[i].pos.y < minYVal) {
                minYVal = hull[i].pos.y;
                minYIdx = i;
            }
            if (hull[i].pos.y > maxYVal) {
                maxYVal = hull[i].pos.y;
                maxYIdx = i;
            }
            if (hull[i].pos.x < minXVal) {
                minXVal = hull[i].pos.x;
                minXIdx = i;
            }
            if (hull[i].pos.x > maxXVal) {
                maxXVal = hull[i].pos.x;
                maxXIdx = i;
            }
        }

        let caliperAVec = new Point(-1, 0, 15);
        let caliperAIdx = minYIdx;
        let caliperBVec = new Point(0, 1, 15);
        let caliperBIdx = minXIdx;
        let caliperCVec = new Point(1, 0, 15);
        let caliperCIdx = maxYIdx;
        let caliperDVec = new Point(0, -1, 15);
        let caliperDIdx = maxXIdx;

        for (let i = 0; i < n + 2; i++) {
            const A = hull[caliperAIdx];
            const B = hull[caliperBIdx];
            const C = hull[caliperCIdx];
            const D = hull[caliperDIdx];

            const ABIntersection = this.lineIntersection(A, A.add(caliperAVec), B, B.add(caliperBVec));
            const BCIntersection = this.lineIntersection(B, B.add(caliperBVec), C, C.add(caliperCVec));
            const CDIntersection = this.lineIntersection(C, C.add(caliperCVec), D, D.add(caliperDVec));
            const DAIntersection = this.lineIntersection(D, D.add(caliperDVec), A, A.add(caliperAVec));

            if (!ABIntersection || !BCIntersection || !CDIntersection || !DAIntersection) {
                continue;
            }

            const width = this.distance(ABIntersection, DAIntersection);
            const height = this.distance(ABIntersection, BCIntersection);
            const area = width * height;
            if (area < minArea) {
                minArea = area;
                bestRectangle = [ABIntersection, BCIntersection, CDIntersection, DAIntersection];
            }

            const angles = [
                this.angleBetweenVectors2D(caliperAVec, new Point(hull[(caliperAIdx + 1) % n].pos.x - A.pos.x, hull[(caliperAIdx + 1) % n].pos.y - A.pos.y)),
                this.angleBetweenVectors2D(caliperBVec, new Point(hull[(caliperBIdx + 1) % n].pos.x - B.pos.x, hull[(caliperBIdx + 1) % n].pos.y - B.pos.y)),
                this.angleBetweenVectors2D(caliperCVec, new Point(hull[(caliperCIdx + 1) % n].pos.x - C.pos.x, hull[(caliperCIdx + 1) % n].pos.y - C.pos.y)),
                this.angleBetweenVectors2D(caliperDVec, new Point(hull[(caliperDIdx + 1) % n].pos.x - D.pos.x, hull[(caliperDIdx + 1) % n].pos.y - D.pos.y))
            ];
            let minAngle = Math.min(...angles);
            for (let j = 0; j < 4; j++) {
                if (angles[j] > 359) {
                    minAngle = angles[j] - 360;
                }
            }

            if (minAngle === angles[0]) {
                caliperAIdx = (caliperAIdx + 1) % n;
                caliperAVec = new Point(hull[caliperAIdx].pos.x - A.pos.x, hull[caliperAIdx].pos.y - A.pos.y, 15);
                caliperCVec = new Point(-caliperAVec.pos.x, -caliperAVec.pos.y, 15);
                caliperBVec = this.rotateVector(caliperBVec, minAngle);
                caliperDVec = this.rotateVector(caliperDVec, minAngle);
            } else if (minAngle === angles[1]) {
                caliperBIdx = (caliperBIdx + 1) % n;
                caliperBVec = new Point(hull[caliperBIdx].pos.x - B.pos.x, hull[caliperBIdx].pos.y - B.pos.y, 15);
                caliperDVec = new Point(-caliperBVec.pos.x, -caliperBVec.pos.y, 15);
                caliperAVec = this.rotateVector(caliperAVec, minAngle);
                caliperCVec = this.rotateVector(caliperCVec, minAngle);
            } else if (minAngle === angles[2]) {
                caliperCIdx = (caliperCIdx + 1) % n;
                caliperCVec = new Point(hull[caliperCIdx].pos.x - C.pos.x, hull[caliperCIdx].pos.y - C.pos.y, 15);
                caliperAVec = new Point(-caliperCVec.pos.x, -caliperCVec.pos.y, 15);
                caliperBVec = this.rotateVector(caliperBVec, minAngle);
                caliperDVec = this.rotateVector(caliperDVec, minAngle);
            } else if (minAngle === angles[3]) {
                caliperDIdx = (caliperDIdx + 1) % n;
                caliperDVec = new Point(hull[caliperDIdx].pos.x - D.pos.x, hull[caliperDIdx].pos.y - D.pos.y, 15);
                caliperBVec = new Point(-caliperDVec.pos.x, -caliperDVec.pos.y, 15);
                caliperAVec = this.rotateVector(caliperAVec, minAngle);
                caliperCVec = this.rotateVector(caliperCVec, minAngle);
            }
        }

        console.log(minArea);
        return bestRectangle;
    }
}
