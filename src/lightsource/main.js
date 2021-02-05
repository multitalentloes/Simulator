let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();

	let cnv = this.getElementById("canvas");
	const cnvw = 1920;
    const cnwh = 1080;
    const divw = cnv.offsetWidth;
    const divh = cnv.offsetHeight;
    const scalex = cnvw/divw;
    const scaley = cnwh/divh;

	this.getElementById("canvas").addEventListener("mousemove", function (e){
		CH.update(e.offsetX*scalex, e.offsetY*scaley);
	});

	this.getElementById("lightsource_toggleRays").addEventListener("click", function(e){CH.flipRays();})
}, false);