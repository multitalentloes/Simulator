/*
    Litt om navnsetting
    metodeNavn()
    variabel_navn
    KlasseNavn
    KONSTANT_NAVN
 */

 const G = 9.81;

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

class DistantJoint{
    constructor(obj1, obj2, e){
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.equilibrium = e; // the joint will not exert force if the objects are at this distance from eachother
        this.ex = e/2;
        this.ey = e/2;
        this.EQUILIBRIUM_CONSTANT = 12; 

        this.calculateForces = this.calculateForces.bind(this);
    }

    calculateForces(){
        //equilibrium = hvor langt unna hverandre de vil være
        //kraften som trekker dem sammen er proporsjonal hvor langt unna de er denne likevekten
        //vi må dekomponere vektoren for å finne i akkurat hvilken vinkel kraften virker
        //til slutt oppdater kraft hos obj1 og obj2
        //console.log(this.equilibrium);
        if (this.distance() >= this.equilibrium * this.equilibrium) {
        
            this.obj1.force.x += this.EQUILIBRIUM_CONSTANT * this.DX();
            this.obj2.force.x -= this.EQUILIBRIUM_CONSTANT * this.DX();

            this.obj1.force.y += this.EQUILIBRIUM_CONSTANT * this.DY();
            this.obj2.force.y -= this.EQUILIBRIUM_CONSTANT * this.DY();
        }
        else { 
            this.obj1.force.x -= this.EQUILIBRIUM_CONSTANT * this.DX();
            this.obj2.force.x += this.EQUILIBRIUM_CONSTANT * this.DX();

            this.obj1.force.y -= this.EQUILIBRIUM_CONSTANT * + this.DY();
            this.obj2.force.y += this.EQUILIBRIUM_CONSTANT * + this.DY();
        }
    }

    distance(){
        return this.DX() * this.DX() + this.DY() * this.DY(); // distance squared
    }

    DX(){
        return this.obj2.pos.x - this.obj1.pos.x;
    }
    
    DY(){
        return this.obj2.pos.y - this.obj1.pos.y;
    }

    draw(c){
        c.beginPath();
        c.moveTo(this.obj1.pos.x, this.obj1.pos.y);
        c.lineTo(this.obj2.pos.x, this.obj2.pos.y);
        c.stroke();
    }
}


class Object{
    constructor(x, y, is_movable){
        this.pos = { // akksesser med this.pos["x"] eller this.pos.x
            "x" : x,
            "y" : y
        }
        this.delta = {
            "x" : 0,
            "y" : 0
        }
        this.force = {
            "x" : 0,
            "y" : 0
        }
        this.acceleration = {
            "x" : 0,
            "y" : 0
        }
        this.is_movable = is_movable;
        this.energy_loss = 1.00;

        this.move = this.move.bind(this);
    }

    move(){
        //this.energy_loss *= 0.999;
        if (this.is_movable){
            this.delta.x += this.energy_loss*this.acceleration.x;
            this.delta.y += this.energy_loss*this.acceleration.y;
            
            this.pos.x += this.energy_loss*this.delta.x;
            this.pos.y += this.energy_loss*this.delta.y;
        }
    }

    resetForces(){
        this.force.x = 0;
        this.force.y = 0;
    }
}


class Circle extends Object{
    constructor(x, y, is_movable, r, MASS_CONSTANT){
        super(x, y, is_movable);
        this.radius = r;
        this.mass = Math.PI*r*r*MASS_CONSTANT;

        this.calculateForces = this.calculateForces.bind(this);
    }

    calculateForces(){
        this.force.y += G; // gravitasjonskraft
    }

    calculateAcceleration() {
        this.acceleration.x = (this.force.x / this.mass);
        this.acceleration.y = (this.force.y / this.mass);
    }

    draw(c){
        
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        c.stroke();
        
    }
}

let CH = null;
document.addEventListener('DOMContentLoaded', function() { // når siden er lastet inn, kjør koden inne bracketen
    CH = new CanvasHandler();
    setInterval(CH.update, 17); //17 ish 60 fps
}, false);