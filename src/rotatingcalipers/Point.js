class Point {
    constructor(x, y, draw_r, draw_color = "#333333") {
        this.pos = {
            "x": x,
            "y": y
        }

        this.draw_radius = draw_r;
        this.draw_color = draw_color;
    }

    draw(c) {
        c.strokeStyle = this.draw_color;
        c.lineWidth = 5;
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.draw_radius, 0, 2 * Math.PI);
        c.fillStyle = "#AAAAAA";
        c.fill();
        c.stroke();
    }

    dist(p2) {
        let DX = this.pos.x - p2.pos.x;
        let DY = this.pos.y - p2.pos.y;
        return Math.sqrt(DX * DX + DY * DY);
    }

    equals(b) {
        return this.pos.x == b.pos.x && this.pos.y == b.pos.y;
    }

    subtract(other) {
        return new Point(this.pos.x - other.pos.x, this.pos.y - other.pos.y, 15);
    }

    add(other) {
        return new Point(this.pos.x + other.pos.x, this.pos.y + other.pos.y, 15);
    }

    multiply(scalar) {
        return new Point(this.pos.x * scalar, this.pos.y * scalar, 15);
    }

    divide(scalar) {
        return new Point(this.pos.x / scalar, this.pos.y / scalar, 15);
    }

    polarAngle(p1) {
        const ySpan = p1.y - this.pos.y;
        const xSpan = p1.x - this.pos.x;
        return Math.atan2(ySpan, xSpan, 15);
    }
}
