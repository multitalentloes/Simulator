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