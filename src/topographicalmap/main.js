let CH = null;
let increase_pos = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    setInterval(() => CH.update(increase_pos), 50);
    let cnv = this.getElementById("topographicalmap_canvas");

    const cnvw = 1920;
    const cnwh = 1080;
    const divw = cnv.offsetWidth;
    const divh = cnv.offsetHeight;
    const scalex = cnvw/divw;
    const scaley = cnwh/divh;

    this.getElementById("topographicalmap_canvas").addEventListener("mousedown", function(e){
        increase_pos = {
            "x" : e.offsetX*scalex,
            "y" : e.offsetY*scaley
        }
    }) 

    this.getElementById("topographicalmap_canvas").addEventListener("mousemove", function(e){
        if (increase_pos){ // if the mouse is pressed down
            increase_pos = {
                "x" : e.offsetX*scalex,
                "y" : e.offsetY*scaley
            }
        }
    }) 

    this.getElementById("topographicalmap_canvas").addEventListener("mouseup", function(e){
        increase_pos = null;
    })
}, false);

