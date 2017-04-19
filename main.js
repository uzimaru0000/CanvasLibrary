'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.preload(['./Images/hog.jpg']);
    APP.display.addEventListener('init', function() {
        var s = new Sprite(100, 100, this.getTexture('./Images/hog.jpg'));
        s.pos = new Vector(s.width / 2, s.height / 2);
        s.addEventListener('update', function(e) {
            this.pos.x += 10;
            if (this.pos.x - this.width / 2 >= APP.display.width) this.pos.x = -this.width / 2;
        });
        this.addChild(s);
    });
}