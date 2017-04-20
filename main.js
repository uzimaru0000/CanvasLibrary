'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.preload(['./Images/hog.jpg']);
    APP.display.addEventListener('init', function() {
        var g = new Group();
        g.pos = new Vector(APP.display.width / 2, APP.display.height / 2);
        var s = new Sprite(100, 100, this.getTexture('./Images/hog.jpg'));
        s.pos = new Vector(s.width / 2, s.height / 2);
        s.addEventListener('mousemove', function(e) {
            if (e.clicked) this.pos = e.localPos;
        });
        g.addChild(s);
        this.addChild(g);
    });
}