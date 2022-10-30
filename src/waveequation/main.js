let CH = null;
let cursor = null;
let cur = null;
let end = null;
let gridw = 75;
let gridh = 75;

document.addEventListener('DOMContentLoaded', function() {
    CH = new CanvasHandler(gridw, gridh);
    let cnv = this.getElementById("waveequationcanvas");
    
    const cnvw = gridw;
    const cnwh = gridh;
    const divw = cnv.offsetWidth;
    const divh = cnv.offsetHeight;
    const scalex = cnvw/divw;
    const scaley = cnwh/divh;
    CH.update(cursor);
    
    setInterval(() => {
        CH.update(cursor);
        if (cursor){
            cursor = null;
        }
    }, 8);

    this.getElementById("waveequationcanvas").addEventListener("mousedown", function(e){
        cursor = {
            "x" : Math.floor(e.offsetX*scalex),
            "y" : Math.floor(e.offsetY*scaley)
        }
    }) 

}, false);
