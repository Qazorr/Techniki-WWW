let mybutton = document.getElementById("top");

window.onscroll = function () {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.cursor = "pointer";
        mybutton.style.opacity = "1";
    } else {
        mybutton.style.cursor = "default";
        mybutton.style.opacity = "0";
    }
}

function topFunction() {
    document.documentElement.scrollTop = 0;
    mybutton.style.opacity = "0";
}