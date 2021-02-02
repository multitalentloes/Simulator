let CH = null;
let start = null;
let cur = null;
let end = null;
document.addEventListener('DOMContentLoaded', function() {
    CH = new CanvasHandler();
    let cnv = this.getElementById("canvas");
    
    const cnvw = 1920;
    const cnwh = 1080;
    const divw = cnv.offsetWidth;
    const divh = cnv.offsetHeight;
    const scalex = cnvw/divw;
    const scaley = cnwh/divh;
    
    setInterval(() => {
        CH.update(start, cur, end);
        if (start && end){
            start = null;
            end = null;
        }
    }, 17);

    this.getElementById("canvas").addEventListener("mousedown", function(e){
        start = {
            "x" : e.offsetX*scalex,
            "y" : e.offsetY*scaley
        }
    }) 

    this.getElementById("canvas").addEventListener("mouseup", function(e){
        end = {
            "x" : e.offsetX*scalex,
            "y" : e.offsetY*scaley
        }
    })
    
    this.getElementById("canvas").addEventListener("mouseout", function(e){
        start = null;
        end = null;
    })

    this.getElementById("canvas").addEventListener("mousemove", function(e){
        cur = {
            "x" : e.offsetX*scalex,
            "y" : e.offsetY*scaley
        }
    })

}, false);
