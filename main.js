'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');

    var s = new Sprite(400, 400, new Texture('./Images/hog.jpg'));
    APP.display.addChild(s);
}