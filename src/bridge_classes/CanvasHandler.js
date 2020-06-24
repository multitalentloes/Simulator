class CanvasHandler{
    constructor(){
        this.MASS_CONSTANT = 0.05;
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.BRIDGE_POINTS = 100;
        this.c = document.getElementById("canvas").getContext("2d");

        this.objects = [];
        this.joints = [];

        let y = 200;
        for(let i = 0; i < this.BRIDGE_POINTS; i++){
            let is_in_middle = (i != 0 && i != this.BRIDGE_POINTS-1);
            
            //y = this.getY(y, i);
            this.objects.push(new Point(i*this.WIDTH/(this.BRIDGE_POINTS-1), y, is_in_middle, 12, this.MASS_CONSTANT));
        }

        for(let i = 0; i < this.BRIDGE_POINTS-1; i++){
            this.objects.push(new DistantJoint(NaN, NaN, false, this.objects[i], this.objects[i+1], this.WIDTH/(this.BRIDGE_POINTS+80)));
        }

        this.objects.push(new Circle(500, 50, true, 12, this.MASS_CONSTANT));
        
        this.update = this.update.bind(this);
        this.calculateAllForces = this.calculateAllForces.bind(this);
        this.drawAll = this.drawAll.bind(this);
    }

    update(){
        this.c.clearRect(0, 0, this.WIDTH, this.HEIGHT);

        this.calculateAllForces();
        this.calculateAllCollisions();
        
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
    }

    calculateAllCollisions(){
        for(let i = 0; i < this.objects.length; i++){
            for(let j = i + 1; j < this.objects.length; j++){
                this.calculateCollisions(this.objects[i], this.objects[j]); // updates forces for objects[i] and objects[j] from the collision between them
            }
        }
    }

    calculateCollisions(obj1, obj2){ // (circle, circle), (circle, rectangle), (line, rectangle), (rectangle, rectangle), (line, circle), (line, line)? 
        if ((obj1.TYPE == "DISTANT_JOINT" && obj2.TYPE=="CIRCLE") || (obj2.TYPE == "DISTANT_JOINT" && obj1.TYPE=="CIRCLE")){
            var distance = Math.pow(obj2.pos.x - obj1.pos.x, 2) + Math.pow(obj2.pos.y - obj1.pos.y, 2);
            //console.log(Math.sqrt(distance));
            if (Math.sqrt(distance) <= 10) { 
                console.log("SKRY")
               
                var obj1VX = (obj1.mass - obj2.mass) * obj1.v.x / (obj1.mass + obj2.mass) + 2 * obj2.mass * obj2.v.x / (obj1.mass + obj2.mass);
                var obj1VY = (obj1.mass - obj2.mass) * obj1.v.y / (obj1.mass + obj2.mass) + 2 * obj2.mass * obj2.v.y / (obj1.mass + obj2.mass);
                
                var obj2VX = 2 * obj1.mass * obj1.v.x / (obj1.mass + obj2.mass) + (obj2.mass - obj1.mass) * obj2.v.x / (obj1.mass + obj2.mass);
                var obj2VY = 2 * obj1.mass * obj1.v.y / (obj1.mass + obj2.mass) + (obj2.mass - obj1.mass) * obj2.v.y / (obj1.mass + obj2.mass);
                //console.log(obj1.v.y, obj2.v.y);
                obj1.calculateCollision(obj1VX, obj1VY);
                obj2.calculateCollision(obj2VX, obj2VY);
            }
        }
    }

    drawAll(){
        for(let obj of this.objects){
            obj.draw(this.c);
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