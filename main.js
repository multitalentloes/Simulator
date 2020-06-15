/*
    Litt om navnsetting
    metodeNavn()
    variabel_navn
    KlasseNavn
    KONSTANT_NAVN
 */



/*
    tenker vi bruker setInterval(funksjon, millisekund), innebygd greie i javascript som kjører funksjonen hver
    gang det har gått millisekund, det egner seg nok bra for å tegne skjermen på nytt om og om igjen

    eksempel på setInterval, på nettsiden så teller den 1->2->3->4 hvert 500millisekund
 */
setInterval(changeText, 500);
let i = 0;
function changeText(){
    i++;
    document.getElementById("demo").innerHTML = i.toString();
}

class CanvasHandler{
    constructor(){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        let canvas = document.getElementById("canvas");
        console.log(canvas);
        this.c = canvas.getContext("2d");

        //Number of dots that make up the canvas
        this.c.width = this.WIDTH;
        this.c.height = this.HEIGHT;
    }

    update(){
        console.log("updating screen");
    }
}
let CH = null;

// når vinduet er lastet inn så oppretter vi objektet og starter å tegne skjermen ved et fast intervall
Window.onload = function(){
    let CH = new CanvasHandler();
    setInterval(CH.update, 20);
}

/*
    en overordnet klasse som trekker i alle trådene, denne vil f.eks kalle tegnAlt(), beregnKrefter(), flyttObjekter()
    den tenker jeg har listen over alle objektene som er på skjermen
 */


