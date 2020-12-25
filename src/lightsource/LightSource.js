class LightSource{
    constructor(x, y, radius, color="#F9D765"){
        this.pos = {
            "x" : x,
            "y" : y
        }
        this.radius = radius;
        this.color = color;
    }

    draw_source(c){
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI);
        c.fill();
    }

    draw_rays(c, polygons){
        let rays = this.get_rays(polygons);

        c.strokeStyle = "#EEBB0D";
        c.lineWidth = 4;
        for(let ray of rays){
            c.beginPath();
            c.moveTo(this.pos.x, this.pos.y);
            c.lineTo(this.pos.x + ray.x, this.pos.y + ray.y);
            c.stroke();
        }
    }

    draw_light(c, polygons){
        let rays = this.get_rays(polygons);
        c.lineWidth = 0;
        c.fillStyle = "#FFFFFF";
        c.globalAlpha = 0.8;

        rays.sort(function(a, b){
            const angle_dif = Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x);
            return (angle_dif > 0 ? 1 : angle_dif == 0 ? 0 : -1);
        })

        const X = this.pos.x;
        const Y = this.pos.y;
        const L = rays.length;
        for (let i = 0; i < rays.length; i++){
            c.beginPath();
            c.moveTo(X, Y);
            c.lineTo(X + rays[i].x, Y + rays[i].y);
            c.lineTo(X + rays[(i+1)%L].x, Y + rays[(i+1)%L].y);
            c.closePath();
            c.fill();
        }
        c.globalAlpha = 1;
    }

    get_rays(polygons){
        let rays = [];
        for(let pol of polygons){
            for(let p of pol.vertices){
                let vector = {
                    "x" : p.pos.x - this.pos.x,
                    "y" : p.pos.y - this.pos.y
                };

                rays.push(this.shorten({"x" : vector.x, "y" : vector.y}, polygons));

                const vectorLength = Math.sqrt(vector.x*vector.x+vector.y*vector.y);
                const newLength = 1920+1080;
                const multiplier = newLength/vectorLength;
                vector.x *= multiplier;
                vector.y *= multiplier;
                
                
                let theta = 0.0001;
                let newX = vector.x*Math.cos(theta)-vector.y*Math.sin(theta);
                let newY = vector.x*Math.sin(theta)+vector.y*Math.cos(theta);
                let ray = {"x" : newX, "y" : newY};
                rays.push(this.shorten(ray, polygons));

                theta = -theta;
                newX = vector.x*Math.cos(theta)-vector.y*Math.sin(theta);
                newY = vector.x*Math.sin(theta)+vector.y*Math.cos(theta);
                ray = {"x" : newX, "y" : newY};
                rays.push(this.shorten(ray, polygons));
            }
        }
        return rays;
    }

    shorten(ray, polygons){
        for(let pol of polygons){
            for(let i = 0; i < pol.vertices.length; i++){
                //https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
                const len = pol.vertices.length;
                
                const x1 = this.pos.x;
                const y1 = this.pos.y;
                const x2 = x1 + ray.x;
                const y2 = y1 + ray.y;
                
                const x3 = pol.vertices[i].pos.x;
                const y3 = pol.vertices[i].pos.y;
                const x4 = pol.vertices[(i+1)%len].pos.x;
                const y4 = pol.vertices[(i+1)%len].pos.y;

                const den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
                const t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den;
                const u = -((x1-x2)*(y1-y3)-(y1-y2)*(x1-x3))/den;
                if (t >= 0 && t <= 1 && u >= 0 && u <= 1){ // we have an intersection
                    const intersection_vector = {
                        "x" : (x1 + t*(x2-x1)) - this.pos.x,
                        "y" : (y1 + t*(y2-y1)) - this.pos.y
                    }

                    if (this.vectorLengthSquared(ray) > this.vectorLengthSquared(intersection_vector)){
                        ray = intersection_vector;
                    }
                }
            }
        }
        return ray;
    }

    vectorLengthSquared(vec){
        return vec.x*vec.x + vec.y*vec.y;
    }

    vectorLength(vec){
        return Math.sqrt(this.vectorLengthSquared);
    }

    moveTo(x, y){
        this.pos.x = x;
        this.pos.y = y;
    }
}