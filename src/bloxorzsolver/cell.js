class Cell {
    constructor(x, y, w) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.state = "."; // . B P or O
        this.is_end_or_start = false;
    }

    draw(c) {
        if (this.state == ".") {
            c.fillStyle = "white";
        }
        if (this.state == "O") {
            c.fillStyle = "grey";
        }
        if (this.state == "P") {
            if (this.is_end_or_start) {
                c.fillStyle = "red";
            } else {
                c.fillStyle = "green";
            }
        }
        if (this.state == "B") {
            c.fillStyle = "black";
        }
        c.beginPath();
        c.moveTo(this.x, this.y); // Top point
        c.lineTo(this.x + this.width, this.y); // Right point
        c.lineTo(this.x + this.width - this.width * 0.4, this.y + this.width); // Bottom point
        c.lineTo(this.x - this.width * 0.4, this.y + this.width); // Left point
        c.closePath();

        c.fill();

        c.strokeStyle = "black";
        c.lineWidth = 4;
        c.stroke();
    }
}
