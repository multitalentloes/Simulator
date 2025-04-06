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
        c.fillRect(this.x, this.y, this.width, this.width);

        c.strokeStyle = "black";
        c.lineWidth = 4;
        c.strokeRect(this.x, this.y, this.width, this.width);
    }
}
