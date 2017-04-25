'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.preload(['./Images/hog.jpg']);
    APP.display.on('init', function() {
        
    });
}