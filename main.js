'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.isGrid = true;
    APP.display.gridWidth = 1;
    APP.display.preload(['./Images/hog.jpg']);
    APP.display.on('init', function() {
        
    });
}