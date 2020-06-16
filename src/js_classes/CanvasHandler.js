class CanvasHandler{
    constructor(){
        this.MASS_CONSTANT = 0.05;
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.BRIDGE_POINTS = 50;
        this.c = document.getElementById("canvas").getContext("2d");

        this.objects = [];
        this.joints = [];

        let y = 200;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            y = this.getY(y, i);
            this.objects.push(new Circle(i*this.WIDTH/(this.BRIDGE_POINTS-1), y, is_in_middle, 10, this.MASS_CONSTANT));
        }

        for(let i = 0; i < this.BRIDGE_POINTS-1; i++){
            this.joints.push(new DistantJoint(this.objects[i], this.objects[i+1], this.WIDTH/this.BRIDGE_POINTS));
        }
        
        this.update = this.update.bind(this);
        this.calculateAllForces = this.calculateAllForces.bind(this);
        this.drawAll = this.drawAll.bind(this);
    }

    update(){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.calculateAllForces();
        
        for(let obj of this.objects){
            obj.calculateAcceleration();
            obj.move();
            obj.resetForces();
        }

        this.drawAll();
    }

    calculateAllForces(){
        for(let obj of this.objects){
            obj.calculateForces();
        }
        for(let j of this.joints){
            j.calculateForces();
        }
    }

    drawAll(){
        for(let obj of this.objects){
            obj.draw(this.c);
        }
        for(let j of this.joints){
            j.draw(this.c);
        }
    }

    getY(y, i){
        if (i == 0 || i == this.BRIDGE_POINTS-1){
            return 200;
        }
        else{
            return y + Math.floor(Math.random()*10)*(Math.random() >= 0.5 ? 1 : -1);
        }
    }
}