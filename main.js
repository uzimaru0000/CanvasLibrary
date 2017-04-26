'use strict'

let APP = {};

window.onload = () => {
    APP.display = new Display('canvas');
    APP.display.on('init', function() {
        let l = new Label('Hello');
        l.pos = new Vector(this.width / 2, this.height / 2);
        l.fontSize = 50;
        this.addChild(l);
        let p = new Circle(5);
        p.color = 'red';
        l.addChild(p);
    });
}