let CH = null;
document.addEventListener('DOMContentLoaded', function() {
	CH = new CanvasHandler();
    this.getElementById("suff_button").addEventListener("click", function(e){
        let str = document.getElementById("suff_string").value;
        CH.update_tree(str);
    })
}, false);

