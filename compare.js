const Rx = rxjs
const imageOverlay = document.querySelector(".img-comp-overlay");

let slider = document.createElement("div");
slider.setAttribute("class", "img-comp-slider");
slider.style.top = (imageOverlay.offsetHeight / 2) - (slider.offsetHeight / 2) - 20 + "px";
slider.style.left = (imageOverlay.offsetWidth / 2) - (slider.offsetWidth / 2) - 20 + "px";

const parentElement = document.querySelector('.img-comp-container')
parentElement.appendChild(slider);

function initComparisons() {
    compareImages(imageOverlay, slider);
}

let clicked = false;

function compareImages() {
    /*get the width and height of the imageOverlay element*/
    let w = imageOverlay.offsetWidth;
    /*set the width of the imageOverlay element to 50%:*/
    imageOverlay.style.width = (w / 2) + "px";


    const startEvents = ['mousedown', 'touchstart'];
    rxjs.merge(...startEvents.map((ev) => Rx.fromEvent(slider, ev))).subscribe((e) => {
        slideReady(e)
    });

    /*and another function when the mouse button is released:*/
    const endEvents = ['mouseup', 'touchend'];
    rxjs.merge(...endEvents.map((ev) => Rx.fromEvent(slider, ev))).subscribe((e) => {
        slideFinish(e)
    });


    function slideReady(e) {
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*the slider is now clicked and ready to move:*/
        clicked = true;
        /*execute a function when the slider is moved:*/
        const compareEvents = ['mousemove', 'touchmove'];
        rxjs.merge(...compareEvents.map((ev) => Rx.fromEvent(slider, ev))).subscribe((e) => {
            slideMove(e)
        });
    }
    function slideMove(e) {
        /*if the slider is no longer clicked, exit this function:*/
        if (clicked === false) return;
        let pos = getCursorPos(e);
        /*get the cursor's imageArr position:*/

        /*prevent the slider from being positioned outside the image:*/
        if (pos < 0) pos = 0;
        if (pos > w) pos = w;
        /*execute a function that will resize the overlay image according to the cursor:*/
        slide(pos);
    }

    function getCursorPos(e) {
        e = (e.changedTouches) ? e.changedTouches[0] : e;
        /*get the imageArr positions of the image:*/
        let a = imageOverlay.getBoundingClientRect();
        /*calculate the cursor's imageArr coordinate, relative to the image:*/
        let x = e.pageX - a.left;
        /*consider any page scrolling:*/
        return x - window.pageXOffset;
    }
}



function slide(x) {
    /*resize the image:*/
    imageOverlay.style.width = x + "px";
    /*position the slider:*/
    slider.style.left = imageOverlay.offsetWidth - (slider.offsetWidth / 2) + "px";
}
function slideFinish() {
    /*the slider is no longer clicked:*/
    clicked = false;
}


initComparisons();