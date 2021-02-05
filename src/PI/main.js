document.addEventListener('DOMContentLoaded', function() {
    CH = new CanvasHandler();
    let cnv = this.getElementById("PI_canvas");

    setInterval(() => {
        CH.update();

        let res = "Approximation: " + (4*CH.insideCNT/(CH.insideCNT + CH.outsideCNT)).toPrecision(4);

        document.getElementById("data").innerHTML = res;
    }, 10);

    document.getElementById("restart").addEventListener("click", function(){
        CH.restart();
    });

}, false);
