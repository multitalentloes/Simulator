class CanvasHandler{
    constructor(){
        this.WIDTH  = 1080;
        this.HEIGHT = 1080;

        this.c = document.getElementById("PI_canvas").getContext("2d");

        this.insideCNT = 0;
        this.outsideCNT = 0;
    }

    update(){
        let x = Math.random()*1080;
        let y = Math.random()*1080;
        let p = new Point(x, y, 4);
        p.draw(this.c);

        if (p.isInside()){
            this.insideCNT++;
        }
        else{
            this.outsideCNT++;
        }
    }

    restart(){
        this.insideCNT = 0;
        this.outsideCNT = 0;
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    }
}